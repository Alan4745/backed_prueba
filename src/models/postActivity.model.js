/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const postActivitySChema = new Schema({
  titlePost: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  pictures: {
    type: String,
  },
  video: {
    type: String,
  },
  location: {
    type: String
  },
  Comments: {
    type: Array,
    default: []
  },
  Likes: {
    type: Array,
    default: []
  }

});

module.exports = mongoose.model('postactivitys', postActivitySChema);
