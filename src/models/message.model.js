const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageSchema = new Schema({
  conversationId: String,
  sender: String,
  text: String,
});

module.exports = mongoose.model('Messages', MessageSchema);
