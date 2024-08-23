const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");
const validator = require("validator"); // Asegúrate de instalar la librería validator

// Función para registrar datos
// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    const { name, lastname, email, phone, dob, department } = req.body;

    if (!name || !lastname || !email || !phone || !dob || !department) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos.",
      });
    }

    if (!validator.isEmail(email)) {
      console.log("El correo electrónico no es válido.");
      return res.status(400).json({
        success: false,
        message: "El correo electrónico no es válido.",
      });
    }

    if (!/^\d{8}$/.test(phone)) {
      console.log("El número de teléfono debe tener exactamente 8 dígitos.");
      return res.status(400).json({
        success: false,
        message: "El número de teléfono debe tener exactamente 8 dígitos.",
      });
    }

    const existingData = await DataPepsiModel.findOne({ email });

    if (existingData) {
      if (existingData.winner) {
        console.log(
          "El usuario ya ha ganado un premio y no puede participar más."
        );
        return res.status(400).json({
          success: false,
          message:
            "El usuario ya ha ganado un premio y no puede participar más.",
        });
      }

      return res.status(200).json({
        success: true,
        message: existingData,
      });
    } else {
      const newData = new DataPepsiModel({
        name,
        lastname,
        email,
        phone,
        dob,
        department,
      });

      await newData.save();

      res.status(200).json({
        success: true,
        message: newData,
      });
    }
  } catch (error) {
    console.error("Error al registrar los datos:", error);
    res.status(500).json({
      success: false,
      message:
        "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.",
    });
  }
}

module.exports = {
  RegistrarData,
};
