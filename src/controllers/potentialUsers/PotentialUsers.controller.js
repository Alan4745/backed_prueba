const PotentialUsers = require("../../models/potentialUsers/potentialUsers.model");

const createPotentialUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dpi,
      email,
      phone,
      birthDate,
      department,
      ticketsObtained,
    } = req.body;

    // Crea una nueva instancia del modelo
    const newUser = new PotentialUsers({
      firstName,
      lastName,
      dpi,
      email,
      phone,
      birthDate,
      department,
      ticketsObtained,
    });

    // Guarda el nuevo usuario en la base de datos
    const savedUser = await newUser.save();

    // Envía una respuesta de éxito
    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: savedUser,
    });
  } catch (error) {
    // Envía una respuesta de error en caso de problemas
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createPotentialUser,
};
