/* eslint-disable linebreak-style */
const community = require('../models/community.model');

function registerCommunity(req, res) {
  const communityModels = new community();
  const parameters = req.body;

  communityModels.nickName = parameters.nickName;
}

module.exports = {
  registerCommunity,
};
