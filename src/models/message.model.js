const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    message: String,
    from: String
})

module.exports = mongoose.model('Messages', MessageSchema);