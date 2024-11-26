const AdrenalineDataModel = require("../../models/adrenalineData/adrenalineData.model");
const validator = require("validator"); // Asegúrate de instalar la librería validator

// Función para registrar datos
async function RegistrarData(req, res) {
  try {
    const { name, lastname, email, phone, dpi, dateOfBirth } = req.body;

    if (!name || !lastname || !email || !phone || !dpi || !dateOfBirth) {
      console.log("Todos los campos son requeridos.");
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

    if (!/^\d{13}$/.test(dpi)) {
      console.log("El DPI debe tener exactamente 13 dígitos.");
      return res.status(400).json({
        success: false,
        message: "El DPI debe tener exactamente 13 dígitos.",
      });
    }

    const calculateAge = (dob) => {
      const diff = Date.now() - new Date(dob).getTime();
      const ageDate = new Date(diff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      console.log("Debe ser mayor de edad para registrarse.");
      return res.status(400).json({
        success: false,
        message: "Debe ser mayor de edad para registrarse.",
      });
    }

    const existingData = await AdrenalineDataModel.findOne({
      $or: [{ email: email }, { dpi: dpi }],
    });

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
      const newData = new AdrenalineDataModel({
        name,
        lastname,
        email,
        phone,
        dpi,
        age,
        dateOfBirth,
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

// Función para contar elementos en el array ticketsCollected y calcular el promedio
async function obtenerPromedioTickets(req, res) {
  try {
    const allData = await AdrenalineDataModel.find({});
    const totalRegistros = allData.length;

    if (totalRegistros === 0) {
      return res.status(200).json({
        success: true,
        Usuarios: 0,
        "Participación promedio x usuario": 0,
      });
    }

    const totalTickets = allData.reduce(
      (acc, data) => acc + data.ticketsCollected.length,
      0
    );
    const promedioTickets = Math.floor(totalTickets / totalRegistros);

    res.status(200).json({
      success: true,
      Usuarios: totalRegistros,
      "Participación promedio x usuario": promedioTickets,
    });
  } catch (error) {
    console.error("Error al obtener el promedio de tickets:", error);
    res.status(500).json({
      success: false,
      message:
        "Error interno del servidor. Por favor, inténtelo de nuevo más tarde.",
    });
  }
}

module.exports = {
  RegistrarData,
  obtenerPromedioTickets,
};
