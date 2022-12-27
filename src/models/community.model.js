/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const communitySchema = new Schema(
  {
    nickName: {
      type: String,
      required: true,
    },
    nameCommunity: {
      type: String,
    },
    desc: {
      type: String,
      max: 500,
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    category: {
      type: Array,
      default: [],
    },
    idUsuario: {
      type: String,
    },
    administrators: {
      type: Array,
      default: [],
    },
  },
);

module.exports = mongoose.model('communitys', communitySchema);
