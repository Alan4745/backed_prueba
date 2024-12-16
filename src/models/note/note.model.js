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
    required: false,
  },
  type: {
    type: String,
    enum: ["normal", "ar"],
    required: true,
  },
  image: {
    public_id: { type: String, default: "" },
    secure_url: { type: String, default: "" },
  },
  audio: {
    public_id: { type: String, default: "" },
    secure_url: { type: String, default: "" },
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
    required: false,
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
  saveStatus: {
    type: Boolean,
    default: false,
  },
});

const Note = mongoose.model("Note", noteSchema);

module.exports = { Note };
