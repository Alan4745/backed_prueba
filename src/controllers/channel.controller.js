/* eslint-disable linebreak-style */
const Channel = require('../models/channelCommunity.model');

function saveChannel(req, res) {
  const channelModel = new Channel();
  const parameters = req.body;
  const { idCommunity } = req.params;

  channelModel.idCommunity = idCommunity;
  channelModel.idOwner = req.user.sub;
  channelModel.nameChanel = parameters.nameChanel;
  channelModel.members = [req.user.sub];
  channelModel.save((err, saveChannel) => {
    if (err) {
      return res.status(500)
        .send({ message: 'err en la peticion', err });
    }
    if (!saveChannel) {
      return res.status(500)
        .send({ message: 'err al guardar el Canal' });
    }
    return res.status(200).send({ status: 'Success', saveMessage: saveChannel });
  });
}

function viewChannel(req, res) {
  Channel.find(
    { members: { $all: [req.user.sub] } },
    (err, channelFind) => {
      res.status(200).send({ channel: channelFind });
    }
  );
}

module.exports = {
  saveChannel,
  viewChannel
};
