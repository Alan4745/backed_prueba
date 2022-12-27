const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    nickName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    rol: {
      type: String,
      default: 'dimensionUser',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Users', userSchema);
