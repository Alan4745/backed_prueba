const mongoose = require('mongoose');

const { Schema } = mongoose;

const collectionsSchema = new Schema({
  hash: {
    type: String,
    require: true
  },
  nameCollection: {
    type: String,
    require: true
  },
  desc: {
    type: String,
    require: true
  },
  img: {
    imgUrl: {
      type: String,
      default: ''
    },
    imgId: {
      type: String,
      default: ''
    }
  },
  author: {
    type: String,
    require: true
  }
}, { timestamps: true },);

module.exports = mongoose.model('collections', collectionsSchema);
