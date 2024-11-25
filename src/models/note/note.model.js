const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    default: "",
  },
  rating: {
    type: Number,
  },
});

const noteSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId, // referencia al usuario remitente
    ref: "Users",
    required: true,
  },
  reciverId: {
    type: Schema.Types.ObjectId, // referencia al usuario receptor
    ref: "Users",
    required: true,
  },
  type: {
    type: String,
    enum: ["normal", "ar"],
    required: true,
  },
  likes: {
    type: [
      {
        userId: { type: String, required: true },
      },
    ],
    default: [],
  },
  comments: { type: [commentSchema], default: [] },
  noteContent: {
    type: String,
    required: true,
  },
  statusNote: {
    type: String,
    enum: ["public", "anonymous"],
    required: true,
  },
  coordinates: {
    type: [Number], // Array de números para coordenadas
    required: true,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
