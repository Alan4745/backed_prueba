const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema(
  {
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
    type: {
      type: String,
    },
    commentPost: {
      type: Boolean,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Post', postSchema);
