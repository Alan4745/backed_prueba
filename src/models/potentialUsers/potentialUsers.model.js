const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define el esquema
const potentialUserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dpi: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  ticketsObtained: {
    type: Array,
    default: [],
  },
});

// Crea el modelo
const PotentialUsers = mongoose.model("PotentialUsers", potentialUserSchema);

module.exports = PotentialUsers;
