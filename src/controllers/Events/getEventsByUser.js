const { Events } = require('../../models/events/events.model');
const mongoose = require("mongoose");


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
    getEventsByUser,
}
