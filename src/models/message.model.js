const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    conversationId: String,
    sender: String,
    text: String,
})

module.exports = mongoose.model('Messages', MessageSchema);