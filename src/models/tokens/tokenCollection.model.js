const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenCollectionSchema = new Schema({
  hash: {
    type: String,
    require: true
  },
  numertoken: {
    type: Number,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  subTitle: {
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
  price: {
    type: Number,
    required: true
  },
  idCollection: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    require: true
  },
  buyers: {
    type: Array,
    default: []
  }

}, { timestamps: true },);

module.exports = mongoose.model('tokenCollections', tokenCollectionSchema);
