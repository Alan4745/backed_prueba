/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
const community = require('../models/community.model');
// const ConversationModel = require('../models/Conversation.model');

exports.AdminComunity = function (req, res, next) {
  community.findOne({ _id: req.params.idCommuunity }, (err, community1) => {
    const userOwner = community1.idUsuario === req.user.sub;
    // console.log(userOwner);
    const userInclud = community1.administrators.includes(req.user.sub);
    // console.log(!userOwner && !userInclud);
    if (!userOwner && !userInclud) { return res.status(403).send({ mensaje: 'Solo puede acceder el ADMIN' }); }
    next();
  });
};

exports.ownerCommunity = function (req, res, next) {
  community.findOne({ _id: req.params.idCommuunity }, (err, community1) => {
    const userOwner = community1.idUsuario === req.user.sub;
    if (!userOwner) { return res.status(403).send({ mensaje: 'Solo puede acceder el Dueño' }); }
    next();
  });
};
