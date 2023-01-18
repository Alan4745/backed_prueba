/* eslint-disable no-shadow */
const Message = require('../models/message.model');
const Conversation = require('../models/Conversation.model');

function SaveMessage(req, res) {
  const messageModel = new Message();
  const parameters = req.body;
  const senderId = req.params.receiverId;

  Conversation.find({ members: { $all: [senderId, req.user.sub] } }, (err, ConversationFindOne) => {
    messageModel.conversationId = ConversationFindOne[0].id;
    messageModel.sender = req.user.sub;
    messageModel.text = parameters.text;

    messageModel.save((err, saveMessage) => {
      if (err) {
        return res.status(500)
          .send({ message: 'err en la peticion', err });
      }

      if (!saveMessage) {
        return res.status(500)
          .send({ message: 'err al guardar el usuario' });
      }

      return res.status(200).send({ status: 'Success', saveMessage });
    });
  });
}

function ViewMessage(req, res) {
  const senderId = req.params.receiverId;

  Conversation.find({ members: { $all: [senderId, req.user.sub] } }, (err, ConversationFindOne) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    Message.find(
      { conversationId: ConversationFindOne[0].id },
      (err, messageView) => res.status(200).send({ status: 'Success', messageView })
    );
  });
}

module.exports = {
  SaveMessage,
  ViewMessage,
};
