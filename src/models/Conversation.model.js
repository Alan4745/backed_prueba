const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ConversationSchema = new Schema({

    members: []
});

module.exports = mongoose.model("Conversation", ConversationSchema);