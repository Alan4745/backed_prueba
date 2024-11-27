const mongoose = require("mongoose");
const { Schema } = mongoose;

const placeFavSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId, // Referencia al usuario remitente
    ref: "Users",
    required: true,
  },
  reciverIds: {
    type: [Schema.Types.ObjectId], // Arreglo de referencias a usuarios receptores
    ref: "Users",
    required: true,
  },
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  type: {
    type: String,
    enum: ["like", "anchor", "share"],
    required: true,
    // default: "like",
  },
  coordinates: {
    type: [Number], // Array de números para coordenadas
    required: true,
  },
});

const placeFav = mongoose.model("placeFav", placeFavSchema);

module.exports = { placeFav };
