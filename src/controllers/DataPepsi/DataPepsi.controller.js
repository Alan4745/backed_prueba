const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");

// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, lastname, dpi, email, phone, dob, department } = req.body;

    // Buscar un documento existente por DPI
    let data = await DataPepsi.findOne({ dpi });

    if (data) {
      // Si el DPI ya existe, actualizar el contador de registros
      await DataPepsi.updateOne({ dpi }, { $inc: { registrationCount: 1 } });

      // Enviar una respuesta indicando que el DPI ya existe
      res.status(200).json({
        success: true,
        message: "DPI ya registrado. Contador incrementado.",
      });
    } else {
      // Si el DPI no existe, crear una nueva entrada
      const newData = new DataPepsi({
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
      res
        .status(200)
        .json({ success: true, message: "Datos registrados exitosamente" });
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
