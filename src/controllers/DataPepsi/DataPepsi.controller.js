const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");
const validator = require("validator"); // Asegúrate de instalar la librería validator

// Función para registrar datos
// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, lastname, dpi, email, phone, dob, department } = req.body;

    // Validar campos requeridos
    if (!name || !lastname || !dpi || !email || !phone || !dob || !department) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos.",
      });
    }

    // Validar que el DPI tenga 13 dígitos
    if (!/^\d{13}$/.test(dpi)) {
      return res.status(400).json({
        success: false,
        message: "El DPI debe tener exactamente 13 dígitos.",
      });
    }

    // Validar el formato del correo electrónico
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico no es válido.",
      });
    }

    // Validar que el teléfono tenga 8 dígitos
    if (!/^\d{8}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "El número de teléfono debe tener exactamente 8 dígitos.",
      });
    }

    // Buscar un documento existente por DPI
    const existingData = await DataPepsiModel.findOne({ dpi });

    if (existingData) {
      if (existingData.winner) {
        // Si el usuario ya es un ganador, devolver un error
        return res.status(400).json({
          success: false,
          message:
            "El usuario ya ha ganado un premio y no puede participar más.",
        });
      }

      // Si el DPI ya existe y el usuario no es un ganador, permitir el registro
      return res.status(200).json({
        success: true,
        message: existingData,
      });
    } else {
      // Si el DPI no existe, crear una nueva entrada
      const newData = new DataPepsiModel({
        name,
        lastname,
        dpi,
        email,
        phone,
        dob,
        department,
      });

      // Guardar los datos en la base de datos
      await newData.save();

      // Enviar una respuesta de éxito
      res.status(200).json({
        success: true,
        message: newData,
      });
    }
  } catch (error) {
    // Enviar una respuesta de error en caso de excepción
    res.status(500).json({
      success: false,
      message: `Error al registrar los datos: ${error.message}`,
    });
  }
}

module.exports = {
  RegistrarData,
};
