const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const Chat = require('../Models/RealtimeChat/ChatModel.js');
const Message = require('../Models/RealtimeChat/MessagesModel.js');
const mongoose = require('mongoose');



// Send a new message in a chat conversation
exports.sendMessage = asyncerrorhandler(async (req, res, next) => {
  const { chatId, sender, content} = req.body;

  // Validate chatId (make sure it's a valid MongoDB ObjectId)
  if (!mongoose.isValidObjectId(chatId)) {
    return next({ message: 'Invalid chatId format.', statusCode: 400 });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next({ message: 'Chat not found.', statusCode: 404 });
  }

  const newMessage = await Message.create({
    chat: chatId,
    sender,
    content,
  });

  return res.status(201).json({ message: newMessage });

  });



  // Get messages for a specific chat conversation with pagination
exports.getMessages = asyncerrorhandler(async (req, res, next) => {
    const chatId = req.params.chatId;
    const { page, limit } = req.query;
  
    // Validate chatId (make sure it's a valid MongoDB ObjectId)
    if (!mongoose.isValidObjectId(chatId)) {
      return next({ message: 'Invalid chatId format.', statusCode: 400 });
    }
  
    // Parse page and limit parameters or set default values
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const skipItems = (pageNumber - 1) * itemsPerPage;
  
    const totalMessages = await Message.countDocuments({ chat: chatId });
    const messages = await Message.find({ chat: chatId })
      .skip(skipItems)
      .limit(itemsPerPage)
      .sort({ createdAt: 1 });
  
    return res.status(200).json({
      messages,
      totalPages: Math.ceil(totalMessages / itemsPerPage),
      currentPage: pageNumber,
    });
  });


  //Get All Message Of A Chat
exports.GetAllChatMessages = asyncerrorhandler(async(req,res,next)=>{
  const ChatID = req.params.id;
  const ChatExists = await Chat.findById(ChatID);
  if(ChatExists){
      const ChatMessages = await Message.find({chat:ChatID});
      res.status(200).json({success:true,ChatMessages});
  }else{
    next({message:'chat Does Not Exist',statusCode:404});
  }
})  

  
// Delete a message by messageId
exports.deleteMessage = asyncerrorhandler(async (req, res, next) => {
    const messageId = req.params.messageId;
  
    // Validate messageId (make sure it's a valid MongoDB ObjectId)
    if (!mongoose.isValidObjectId(messageId)) {
      return next({ message: 'Invalid messageId format.', statusCode: 400 });
    }
  
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      return next({ message: 'Message not found.', statusCode: 404 });
    }
  
    return res.status(200).json({ message: 'Message deleted successfully.' });
  });