const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String }, // For text messages
 /* type: { type: String }, // "text", "image", "gif", "emoji", etc.
  url: { type: String }, // URL of the attached file (for images, gifs, etc.)*/
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
