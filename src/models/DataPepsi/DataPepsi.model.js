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
    // Nuevo campo: Array para guardar ciertos datos
    additionalData: {
      type: [Schema.Types.Mixed], // Array que puede contener cualquier tipo de datos
      default: [], // Valor por defecto es un array vacío
    },
    // Nuevo campo: Contador de registros
    registrationCount: {
      type: Number,
      default: 0, // Valor por defecto es 0
    },
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Exportar el modelo
module.exports = mongoose.model("DataPepsi", dataPepsiSchema);
