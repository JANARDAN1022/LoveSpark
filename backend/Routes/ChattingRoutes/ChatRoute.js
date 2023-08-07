const router = require('express').Router();
const {authenticate} = require('../../Middlewares/Auth.js');
const {createNewChat,deleteChat,getConversations,getSingleConversation} = require('../../Controllers/ChatController.js');

// Create a new chat conversation
router.route('/').post(authenticate,createNewChat);

// Delete a chat conversation by chatId
router.route('/Delete/:chatId').delete(authenticate,deleteChat);

// Get conversations for a user
router.route('/conversations/:id').get(authenticate,getConversations);

// Get a single conversation by chatId
router.route('/Single/:id/:chatId').get(authenticate,getSingleConversation);


module.exports = router;