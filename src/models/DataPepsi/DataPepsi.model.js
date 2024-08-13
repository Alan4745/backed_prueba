const mongoose = require("mongoose");
const { Schema } = mongoose;

// Definir el esquema para el formulario de registro
const dataPepsiSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    dpi: {
      type: String,
      required: true,
      unique: true, // Asegurarse de que el DPI sea único
    },
    email: {
      type: String,
      required: true,
      unique: true, // Asegurarse de que el correo electrónico sea único
    },
    phone: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    // Campo que indica si el usuario ya se ha registrado
    hasRegistered: {
      type: Boolean,
      default: false, // Por defecto, aún no se ha registrado
    },
    // Campo que indica si el usuario es un ganador
    winner: {
      type: Boolean,
      default: false, // Inicialmente no se considera ganador
    },
    // Campo para almacenar los tickets recogidos
    ticketsCollected: {
      type: [Schema.Types.Mixed], // Array que puede contener cualquier tipo de datos
      default: [], // Valor por defecto es un array vacío
    },
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Exportar el modelo
module.exports = mongoose.model("DataPepsi", dataPepsiSchema);
