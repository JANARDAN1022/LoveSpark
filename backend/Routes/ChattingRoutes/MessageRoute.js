const router = require('express').Router();
const {authenticate} = require('../../Middlewares/Auth.js');
const {deleteMessage,getMessages,sendMessage,GetAllChatMessages} = require('../../Controllers/MessageController.js');

// Send a new message in a chat conversation
router.route('/Send').post(authenticate,sendMessage);

router.route('/:id').get(authenticate,GetAllChatMessages);

// Get messages for a specific chat conversation with pagination
router.route('/:chatId').get(authenticate,getMessages);

// Delete a message by messageId
router.route('/Delete/:messageId').delete(authenticate,deleteMessage);

module.exports = router;
