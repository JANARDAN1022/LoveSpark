const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This refers to the "User" model, assuming you have a "User" model for the users
    required: true
  },
  swipedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This also refers to the "User" model
    required: true
  },
  direction: {
    type: String,
    enum: ['left', 'right'],
    required: true
  },
  Status:{
    type:String,
    required: true
  }
});


module.exports = mongoose.model('Swipe', swipeSchema);
