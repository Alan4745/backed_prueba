const { Events } = require('../../models/events/events.model');
const { UploadImg } = require("../../utils/cloudinary");
const userModel = require("../../models/user.model");

const fs = require("fs-extra");

const mongoose = require("mongoose");

const createEvent = async (req, res) => {
    try {
        const { senderId, reciverIds } = req.body;
        console.log(req.body);

        // Convertir reciverIds a un arreglo si viene como string
        const parsedReciverIds = Array.isArray(reciverIds)
            ? reciverIds
            : JSON.parse(reciverIds);

        // Validar que todos los IDs son ObjectId válidos
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Sender ID is not valid" });
        }

        const invalidIds = parsedReciverIds.filter(
            (id) => !mongoose.Types.ObjectId.isValid(id)
        );
        if (invalidIds.length > 0) {
            return res.status(400).json({ message: "One or more IDs are invalid" });
        }

        // Validar existencia del remitente
        const sender = await userModel.findById(senderId);
        if (!sender) {
            return res.status(404).json({ message: "Remitente no encontrado" });
        }

        // Validar existencia de los receptores
        const receivers = await userModel.find({ _id: { $in: parsedReciverIds } });
        if (receivers.length !== parsedReciverIds.length) {
            return res.status(404).json({ message: "Uno o más receptores no existen" });
        }

        // Cargar la imagen principal si existe
        let image = {};
        if (req.files?.image) {
            const result = await UploadImg(req.files.image.tempFilePath);
            image.public_id = result.public_id;
            image.secure_url = result.secure_url;
            if (fs.existsSync(req.files.image.tempFilePath)) {
                await fs.unlink(req.files.image.tempFilePath);
            }
        }

        // Crear los datos del evento
        const eventData = {
            title: req.body.title,
            type: req.body.type,
            coordinates: JSON.parse(req.body.coordinates),
            radio: req.body.radio,
            dateInit: req.body.dateInit,
            dateEnd: req.body.dateEnd,
            image: image,
            senderId: senderId,
            reciverIds: parsedReciverIds,
        };

        // Crear el evento
        const newEvent = await Events.create(eventData);

        res.status(201).json({
            status: "success",
            data: {
                event: newEvent,
            },
        });
    } catch (error) {
        console.error("Error al crear evento:", error);
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const getEventsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Validar si el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "User ID is not valid" });
        }

        // Buscar eventos donde el usuario sea remitente o receptor
        const events = await Events.find({
            $or: [{ senderId: userId }, { reciverIds: userId }],
        })
            .populate("senderId", "name imageAvatar") // Obtener el nombre y avatar del remitente
            .populate("reciverIds", "name imageAvatar"); // Obtener el nombre y avatar de los receptores

        // Validar si no hay eventos encontrados
        if (!events.length) {
            return res.status(404).json({ message: "No events found for this user" });
        }

        // Responder con los datos obtenidos
        res.status(200).json({
            status: "success",
            data: events,
        });
    } catch (error) {
        console.error("Error retrieving events:", error);
        res.status(500).json({
            status: "error",
            message: "Error retrieving events",
            error: error.message,
        });
    }
};

module.exports = {
    createEvent,
}
