const mongoose = require("mongoose");

const { Schema } = mongoose;

const tokenCollectionSchema = new Schema(
  {
    hash: {
      type: String,
      require: true,
    },
    numertoken: {
      type: Number,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    subTitle: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      require: true,
    },
    img: {
      imgUrl: {
        type: String,
        default: "",
      },
      imgId: {
        type: String,
        default: "",
      },
    },
    price: {
      type: Number,
      default: 0,
      required: true,
    },
    idCollection: {
      type: Schema.Types.ObjectId, // referencia a la collection
      ref: 'collections',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId, // referencia al usuario emisor
      ref: 'Users',
      required: true
    },
    idPost: {
      type: Schema.Types.ObjectId, // referencia al post
      ref: 'Post',
      required: true
    },
    buyerid: {
      type: String,
      default: "",
    },
    adquirido: {
      type: Boolean,
      default: false,
    },
    canjeado: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tokenCollections", tokenCollectionSchema);
