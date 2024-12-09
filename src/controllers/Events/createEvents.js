const { Events } = require('../../models/events/events.model');
const { UploadImg } = require("../../utils/cloudinary");
const fs = require("fs-extra");

const createEvent = async (req, res) => {
    // console.log(req.files.image)
    try {
        let image = {};

        // Cargar imagen principal
        if (req.files?.image) {
            const result = await UploadImg(req.files.image.tempFilePath);
            image.public_id = result.public_id;
            image.secure_url = result.secure_url;
            if (fs.existsSync(req.files.image.tempFilePath)) {
                await fs.unlink(req.files.image.tempFilePath);
            } else {
                console.warn("El archivo temporal no existe.");
            }
        }

        // Preparar datos del evento
        const eventData = {
            title: req.body.title,
            type: req.body.type,
            coordinates: JSON.parse(req.body.coordinates),
            radio: req.body.radio, // Añadido el campo 'radio'
            dateInit: req.body.dateInit,
            dateEnd: req.body.dateEnd,
            image: image,
        };

        // Crear nuevo evento
        const newEvent = await Events.create(eventData);

        res.status(201).json({
            status: 'success',
            data: {
                event: newEvent
            }
        });

    } catch (error) {
        console.error("Error al crear evento:", error);
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
};



module.exports = {
    createEvent,
}
