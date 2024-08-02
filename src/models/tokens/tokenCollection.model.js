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
      type: String,
      require: true,
    },
    author: {
      type: String,
      require: true,
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
    category: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tokenCollections", tokenCollectionSchema);
