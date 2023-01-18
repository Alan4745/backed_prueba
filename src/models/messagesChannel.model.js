/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const MessageChannelSchema = new Schema({
  channelId: {
    type: String,
  },
  sender: {
    type: String,
  },
  text: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('MessagesChannels', MessageChannelSchema);
