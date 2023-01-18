/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable linebreak-style */
const MessagesChannels = require('../models/messagesChannel.model');
const ChannelCommun = require('../models/channelCommunity.model');
const User = require('../models/user.model');

function saveMessagesChannel(req, res) {
  const messageModel = new MessagesChannels();
  const parameters = req.body;
  const { channelId } = req.params;

  messageModel.channelId = channelId;
  messageModel.sender = req.user.sub;
  messageModel.text = parameters.text;

  ChannelCommun.findOne({ _id: channelId }, (err, channel) => {
    // console.log(channel, req.user.sub);
    const mensbers = channel.members.some((item) => item === req.user.sub);

    if (mensbers) {
      messageModel.save((err, saveMessage) => {
        if (err) {
          return res.status(500).send({ message: 'error en la peticion' });
        }

        if (!saveMessage) {
          return res.status(500).send({ message: 'err al guardar el mesaje en canal' });
        }

        return res.status(200).send({ saveMessage });
      });
    } else {
      return res.status(500).send({ err: 'no puede mandar mensajes en este canal' });
    }
  });
}

function viewMessagesChannel(req, res) {
  const { channelId } = req.params;
  ChannelCommun.findOne({ _id: channelId }, (err, viewMembers) => {
    User.find({ _id: viewMembers.members }, { password: 0 }, (err, userFind) => {
      MessagesChannels.find(
        { channelId },
        (err, messagesView) => res.status(200).send({ messagesView, userFind })
      );
    });
  });
}

module.exports = {
  saveMessagesChannel,
  viewMessagesChannel
};
