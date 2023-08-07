const asyncerrorhandler = require('../Middlewares/AsyncError.js');
const ErrorHandler = require('../Middlewares/ErrorHandler.js');
const Chat = require('../Models/RealtimeChat/ChatModel.js');
const Message = require('../Models/RealtimeChat/MessagesModel.js');
const mongoose = require('mongoose');


// Create a new chat conversation between two users
exports.createNewChat = asyncerrorhandler(async (req, res, next) => {
    const { participants } = req.body;
  
    if (!Array.isArray(participants) || participants.length !== 2) {
      return next({
        message: 'Invalid participants array. You need exactly two participants.',
        statusCode: 400,
      });
    }
  
    // Check if the chat conversation already exists between the two users
    const existingChat = await Chat.findOne({ participants: { $all: participants } });
    if (existingChat) {
      return res.status(200).json({ chat: existingChat });
    }
  
    const newChat = await Chat.create({ participants });
    return res.status(201).json({ chat: newChat });
  });

// Delete a chat conversation by chatId
exports.deleteChat = asyncerrorhandler(async (req, res, next) => {
    const chatId = req.params.chatId;
  
    // Validate chatId (make sure it's a valid MongoDB ObjectId)
    if (!mongoose.isValidObjectId(chatId)) {
      return next({ message: 'Invalid chatId format.', statusCode: 400 });
    }
  
    const chat = await Chat.findByIdAndDelete(chatId);
    if (!chat) {
      return next({ message: 'Chat not found.', statusCode: 404 });
    }
  
    // Delete all messages associated with the chat
    await Message.deleteMany({ chat: chatId });
  
    return res.status(200).json({ message: 'Chat deleted successfully.' });
  });



  
// Get conversations for a user
exports.getConversations = asyncerrorhandler(async (req, res, next) => {
    const userId = req.params.id; // Assuming you have implemented user authentication
  
    // Find all conversations where the user is a participant
    const conversations = await Chat.find({ participants:{$in:[userId]} })
      .populate('participants', 'FirstName LastName ProfileUrl')
      .sort({ createdAt: -1 });
  
    return res.status(200).json({ conversations });
  });



  // Get a single conversation by chatId
exports.getSingleConversation = asyncerrorhandler(async (req, res, next) => {
  const  userId = req.params.id;  
  const chatId = req.params.chatId;
  
    // Validate chatId (make sure it's a valid MongoDB ObjectId)
    if (!mongoose.isValidObjectId(chatId)) {
      return next({ message: 'Invalid chatId format.', statusCode: 400 });
    }
  
    const chat = await Chat.findById(chatId).populate('participants', 'FirstName LastName ProfileUrl bio interests occupation CoverUrl');
    if (!chat) {
      return next({ message: 'Chat not found.', statusCode: 404 });
    }
  
    // Check if the user is a participant in the chat
    if (!chat.participants.some((participant) => participant._id.toString() === userId)) {
      return next({ message: 'Unauthorized access to chat.', statusCode: 403 });
    }
  
    // Get messages for the conversation
    const messages = await Message.find({ chat: chatId });
  
    return res.status(200).json({ chat, messages });
  });