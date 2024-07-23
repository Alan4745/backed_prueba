const { Points } = require('../../models/points/points.model');

const createPerimeterPoints = async (req, res) => {
    const { amount, type, coordinates, radius, emitterId } = req.body;

    if (!amount || !type || !coordinates || !emitterId) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    if (type === 'Point' && (!Array.isArray(coordinates) || coordinates.length !== 2)) {
        return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
    }

    if (type === 'Polygon' && (!Array.isArray(coordinates) || coordinates.length < 4 || !coordinates.every(coord => Array.isArray(coord) && coord.length === 2))) {
        return res.status(400).json({ message: 'Coordenadas inválidas para Polygon' });
    }

    try {
        const newPoint = new Points({
            amount,
            location: {
                type,
                coordinates: type === 'Polygon' ? [coordinates] : coordinates
            },
            radius: type === 'Point' ? radius : undefined,
            emitter: emitterId
        });

        await newPoint.save();
        res.status(201).json({ message: 'Punto creado con éxito', point: newPoint });
    } catch (error) {
        console.error('Error al crear el punto:', error);
        res.status(500).json({ message: 'Error al crear el punto', error });
    }
};

const getPerimeterPoints = async (req, res) => {
    try {
        const perimeterPoints = await Points.find();
        res.status(200).json(perimeterPoints);
    } catch (error) {
        console.error('Error al consultar el punto:', error);
        res.status(500).json({ message: 'Error al consultar el punto:', error });
    }
};

module.exports = {
    createPerimeterPoints,
    getPerimeterPoints
};