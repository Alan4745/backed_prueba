const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostSchema = new Schema({

  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    max: 500,
  },
  img: {
    type: String,
  },
  likes: {
    type: String,
    default: [],
  },
});

module.exports = mongoose.model('Posts', PostSchema);
