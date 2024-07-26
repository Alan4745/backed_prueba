const { verifyLocationPerimeter } = require('../../funcs/funcsVerifyLocationPerimeter');
const { Points } = require('../../models/points/points.model');
const { PointsMarked } = require('../../models/points/pointsMarked.model');
const userModel = require('../../models/user.model');

const createPointsMarked = async (req, res) => {
    const { amountPointsMarked, coordinates, idPoints, idEmitter } = req.body;

    if (!amountPointsMarked || !coordinates || !idPoints || !idEmitter) { // hacer una func para esta parte del código
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        // Buscar al usuario
        const userFound = await userModel.findById(idEmitter);
        if (!userFound) {
            return res.status(404).json({ message: 'No se encontró al usuario' });
        }

        // Buscar los puntos al canjear por Id, y verificar que exista
        const pointsFounds = await Points.findById(idPoints);
        if (!pointsFounds) {
            return res.status(404).json({ message: 'No se encontraron los puntos' });
        }

        // Verificar al emisor
        if (pointsFounds.emitter.toString() !== idEmitter) {
            return res.status(400).json({ message: 'El marcador no es el emisor de los puntos' });
        }

        // Verificar si hay suficientes puntos
        if (pointsFounds.amountCurrent < amountPointsMarked) {
            return res.status(400).json({ message: 'No hay suficientes puntos para marcar' });
        }

        const isWithin = await verifyLocationPerimeter(pointsFounds, coordinates);
        if (!isWithin) {
            return res.status(400).json({ message: 'La ubicación del marcador no está dentro del perímetro' });
        }

        // Restar los puntos
        pointsFounds.amountCurrent -= amountPointsMarked;
        await pointsFounds.save();

        // Distribuir los puntos en el marcador
        const newPointMarked = new PointsMarked({
            amountPointsMarked,
            location: {
                type: 'Point',
                coordinates: coordinates
            },
            idPoints,
            redeemed: false
        });

        await newPointMarked.save();
        res.status(201).json({ message: 'Puntos distribuidos con éxito', newPointMarked });
    } catch (error) {
        console.error('Error al crear un marcador:', error);
        res.status(500).json({ message: 'Error al crear marcador', error });
    }
};

const getAllPointsMarked = async (req, res) => {
    try {
        const pointsRedeemed = await PointsMarked.find();
        res.status(200).json(pointsRedeemed);
    } catch (error) {
        console.error('Error al canjear:', error);
        res.status(500).json({ message: 'Error al canjear:', error });
    }
};

module.exports = {
    createPointsMarked,
    getAllPointsMarked
};
