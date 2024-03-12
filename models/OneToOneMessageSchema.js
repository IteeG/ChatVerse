const mongoose = require('mongoose');

// Schema for one-to-one messages
const oneToOneMessageSchema = new mongoose.Schema({
  sender: String,
  recipient: String,
  timestamp: { type: Date, default: Date.now },
  content: String
});

//model export for one to oene message schema
module.exports = mongoose.model('OneToOneMessageSchema', oneToOneMessageSchema);