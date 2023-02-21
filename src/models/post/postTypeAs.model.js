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
    require: true,
  },
  imagenPostTypeA: {
    public_id: {
      type: String,
      default: '',
    },
    secure_url: {
      type: String,
      default: ''
    }
  },
  options: {
    type: Array,
    default: []
  },
  answers: {
    type: Array,
    default: []
  },
  likes: {
    type: Array,
    default: [],
  },
  comentarios: {
    type: Array,
    default: [],
  },
  commentPost: {
    type: Boolean,
  },
  typePost: {
    type: String,
    default: 'PostTypeA'
  }
},
  {
  timestamps: true
  },
);

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
