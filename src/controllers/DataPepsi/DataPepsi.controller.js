const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");
const validator = require("validator"); // Asegúrate de instalar la librería validator

// Función para registrar datos
// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, lastname, email, phone, dob, department } = req.body;

    // Validar campos requeridos
    if (!name || !lastname || !email || !phone || !dob || !department) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos.",
      });
    }

    // Validar el formato del correo electrónico
    if (!validator.isEmail(email)) {
      console.log("El correo electrónico no es válido.");
      return res.status(400).json({
        success: false,
        message: "El correo electrónico no es válido.",
      });
    }

    // Validar que el teléfono tenga 8 dígitos
    if (!/^\d{8}$/.test(phone)) {
      console.log("El número de teléfono debe tener exactamente 8 dígitos.");
      return res.status(400).json({
        success: false,
        message: "El número de teléfono debe tener exactamente 8 dígitos.",
      });
    }

    // Buscar un documento existente por correo electrónico
    const existingData = await DataPepsiModel.findOne({ email });

    if (existingData) {
      if (existingData.winner) {
        // Si el usuario ya es un ganador, devolver un error
        console.log(
          "El usuario ya ha ganado un premio y no puede participar más."
        );

        return res.status(400).json({
          success: false,
          message:
            "El usuario ya ha ganado un premio y no puede participar más.",
        });
      }

      // Si el correo electrónico ya existe y el usuario no es un ganador, permitir el registro
      return res.status(200).json({
        success: true,
        message: existingData,
      });
    } else {
      // Si el correo electrónico no existe, crear una nueva entrada
      const newData = new DataPepsiModel({
        name,
        lastname,
        email,
        phone,
        dob,
        department,
        // No se incluye el campo DPI
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
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error al registrar los datos: ${error.message}`,
    });
  }
}
module.exports = {
  RegistrarData,
};
