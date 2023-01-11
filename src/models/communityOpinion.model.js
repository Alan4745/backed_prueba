/* eslint-disable linebreak-style */
const mongoose = require('mongoose');

const { Schema } = mongoose;
const communityOpinionSChema = new Schema({
  titlePost: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  possibleaAnswers: {
    type: Array,
    required: true,
  },
  answerUser: {
    type: Array,
  },
  datatime: {
    type: Date,
    required: true
  },
  comments: {
    type: Array,
  },
  reactions: {
    type: Array,
  }
});

module.exports = mongoose.model('communityOpinions', communityOpinionSChema);
