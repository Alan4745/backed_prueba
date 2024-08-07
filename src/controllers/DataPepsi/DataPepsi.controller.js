const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");

// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, lastname, dpi, email, phone, dob, department } = req.body;

    // Buscar un documento existente por DPI
    const existingData = await DataPepsiModel.findOne({ dpi });

    if (existingData) {
      if (existingData.hasRegistered) {
        // Si el DPI ya existe y ya se ha registrado, devolver un error
        return res.status(400).json({
          success: false,
          message: "El DPI ya ha sido registrado.",
        });
      } else {
        // Si el DPI existe pero no se ha registrado, permitir el registro sin modificar `hasRegistered`
        return res.status(200).json({
          success: true,
          message:
            "El DPI existe pero no se ha registrado. Puedes registrar los datos.",
          data: existingData,
        });
      }
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
        // No se modifica `hasRegistered` en la creación
      });

      // Guardar los datos en la base de datos
      await newData.save();

      // Enviar una respuesta de éxito
      res.status(200).json({
        success: true,
        message: "Datos registrados exitosamente.",
        data: newData,
      });
    }
  } catch (error) {
    // Enviar una respuesta de error en caso de excepción
    res.status(500).json({
      success: false,
      message: "Error al registrar los datos",
      error: error.message,
    });
  }
}

module.exports = {
  RegistrarData,
};
