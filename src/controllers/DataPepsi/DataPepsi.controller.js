const DataPepsiModel = require("../../models/DataPepsi/DataPepsi.model");

// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    const { name, lastname, dpi, email, phone, dob, department } = req.body;

    // Crear un nuevo documento
    const newDataPepsi = new DataPepsiModel({
      name,
      lastname,
      dpi,
      email,
      phone,
      dob,
      department,
    });

    // Guardar en la base de datos
    await newDataPepsi.save();

    res
      .status(201)
      .json({ message: "Datos registrados con éxito", data: newDataPepsi });
  } catch (error) {
    console.error("Error al registrar los datos:", error);
    res
      .status(500)
      .json({ message: "Error al registrar los datos", error: error.message });
  }
}

module.exports = {
  RegistrarData,
};
