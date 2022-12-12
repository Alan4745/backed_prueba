const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
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
  desc: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  rol: {
    type: String,
    default: 'mobileUser',
  },
  category: {
    type: Array,
    default: ['Sin categoria'],
  },
});

module.exports = mongoose.model('Users', userSchema);
