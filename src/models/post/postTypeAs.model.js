const mongoose = require('mongoose');

const { Schema } = mongoose;

const postTypeASchema = new Schema({
  communityId: {
    type: String
  },
  communityName: {
    type: String
  },
  question: {
    type: String,
  },
  options: {
    type: Array,
    default: []
  },
  answers: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('postTypeAs', postTypeASchema);

// const mongoose = require('mongoose');

// const optionSchema = new mongoose.Schema({
//   id: Number,
//   text: String
// });

// const answerSchema = new mongoose.Schema({
//   userId: Number,
//   optionId: Number
// });

// const surveySchema = new mongoose.Schema({
//   id: Number,
//   question: String,
//   options: [optionSchema],
//   answers: [answerSchema]
// });

// const Survey = mongoose.model('Survey', surveySchema);

// module.exports = Survey;
