const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  model: {
    type: String,
    required: true,
    unique: true,
  },
  sequence_value: {
    type: Number,
    default: 0,
  },
});

const Counter = mongoose.model("Counter", counterSchema);

module.exports = Counter;
