const mongoose = require('mongoose');

const MatchedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This refers to the "User" model, assuming you have a "User" model for the users
    required: true
  },
  swipedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // This also refers to the "User" model
    required: true
  }
});


module.exports = mongoose.model('Matched', MatchedSchema);
