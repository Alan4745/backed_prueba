const {Points} = require('../../models/points.model')

const createPerimeterPoints = async(req, res) => {
    const { amount, longitude, latitude, radius, emitterId } = req.body;

    if (!amount || !longitude || !latitude || !radius || !emitterId) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        const newPoint = new Points({
            amount,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            radius,
            emitter: emitterId
        });

        await newPoint.save();
        res.status(201).json({ message: 'Punto creado con éxito', point: newPoint });
    } catch (error) {
        console.error('Error al crear el punto:', error);
        res.status(500).json({ message: 'Error al crear el punto', error });
    }
}

module.exports = {
    createPerimeterPoints
}