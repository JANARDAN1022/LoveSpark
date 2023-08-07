const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  ReceivedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  ReportedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  Reason: {
    type: String,
    required: true
  },
});


module.exports = mongoose.model('Report', ReportSchema);
