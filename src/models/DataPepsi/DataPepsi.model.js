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
  },
  {
    timestamps: true, // Añade campos createdAt y updatedAt automáticamente
  }
);

// Exportar el modelo
module.exports = mongoose.model("DataPepsi", dataPepsiSchema);
