const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({

  userId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    max: 500,
  },
  img: {
    type: String,
    default: '',
  },
  likes: {
    type: Array,
    default: [],
  },
  comentarios: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model('Post', postSchema);
