const mongoose = require('mongoose');

//schema for the group messages
const groupMessageSchema = new mongoose.Schema({
  sender: String,
  groupId: String,
  timestamp: { type: Date, default: Date.now },
  content: String
});

//export one to one message schema
module.exports = mongoose.model('GroupMessageSchema', groupMessageSchema);