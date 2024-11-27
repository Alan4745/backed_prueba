const { placeFav } = require("../../models/placeFav/placefav.model");
const userModel = require("../../models/user.model");

// Función para crear lugares favoritos
const createNewPlaceFav = async (req, res) => {
  try {
    const { senderId, reciverIds, title, type, coordinates } = req.body;

    // Validar longitud del título
    if (title.length > 50) {
      return res.status(400).json({
        message:
          "El título es demasiado largo. Debe tener un máximo de 50 caracteres.",
      });
    }

    // Validar existencia del remitente
    const sender = await userModel.findById(senderId);
    if (!sender) {
      return res.status(404).json({ message: "Remitente no encontrado" });
    }

    // Validar existencia de los receptores
    const receivers = await userModel.find({ _id: { $in: reciverIds } });
    if (receivers.length !== reciverIds.length) {
      return res
        .status(404)
        .json({ message: "Uno o más receptores no existen" });
    }

    // Validar y asignar tipo
    const validTypes = ["like", "anchor", "share"];
    const finalType = validTypes.includes(type) ? type : "like";

    // Crear un nuevo lugar favorito
    const newPlaceFav = await placeFav.create({
      senderId,
      reciverIds,
      title,
      type: finalType,
      coordinates,
    });

    res.status(201).json({
      message: "Lugar favorito creado con éxito",
      placeFav: newPlaceFav,
    });
  } catch (error) {
    console.error("Error al crear un lugar favorito:", error);
    res.status(500).json({ message: "Error al crear lugar favorito", error });
  }
};

// Obtener todos los lugares favoritos con información del remitente y receptor
const getAllPlacesFav = async (req, res) => {
  try {
    const placesfav = await placeFav
      .find()
      .populate("senderId", "name imageAvatar")
      .populate("reciverIds", "name imageAvatar");

    res.status(200).json({ placesfav: placesfav });
  } catch (error) {
    console.error("Error al obtener todos los lugares favoritos:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los lugares favoritos", error });
  }
};

// Obtener notas enviadas por el usuario con información del remitente y receptores
const getSentPlacesFavByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("user: ", userId);
    const placesfav = await placeFav
      .find({ senderId: userId })
      .populate("senderId", "name imageAvatar")
      .populate("reciverIds", "name imageAvatar");

    if (!placesfav.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron notas enviadas por este usuario" });
    }

    res.status(200).json({ placesfav: placesfav });
  } catch (error) {
    console.error(
      "Error al obtener lugares favoritos creadas por el usuario:",
      error
    );
    res.status(500).json({
      message: "Error al obtener lugares favoritos creadas por el usuario",
      error,
    });
  }
};

// Obtener lugares favoritos recibidas por el usuario con información del remitente y receptores
const getReceivedPlacesFavByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const placesfav = await placeFav
      .find({ reciverIds: userId })
      .populate("senderId", "name imageAvatar")
      .populate("reciverIds", "name imageAvatar");
    if (!placesfav.length) {
      return res.status(404).json({
        message: "No se encontraron notas recibidas por este usuario",
      });
    }

    res.status(200).json({ placesfav: placesfav });
  } catch (error) {
    console.error(
      "Error al obtener lugares favoritos recibidas por el usuario:",
      error
    );
    res
      .status(500)
      .json({ message: "Error al obtener lugares favoritos recibidas", error });
  }
};

module.exports = {
  createNewPlaceFav,
  getAllPlacesFav,
  getSentPlacesFavByUser,
  getReceivedPlacesFavByUser,
};
