const { Points } = require('../../models/points/points.model');
const userModel = require("../../models/user.model");

const createPerimeterPoints = async (req, res) => {
    const { amount, type, coordinates, emitterId } = req.body;

    if (!amount || !type || !coordinates || !emitterId) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Validación para 'Point'
    if (type === 'Point') {
        if (!Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
            return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
        }
    }

    try {
        const newPoint = new Points({
            amountCurrent: amount,
            amountInitial: amount,
            location: {
                type,
                coordinates: type === 'Polygon' ? coordinates : coordinates
            },
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
        console.error('Error al consultar los puntos:', error);
        res.status(500).json({ message: 'Error al consultar los puntos', error });
    }
};

const getPerimeterPointById = async (req, res) => {
    const { id } = req.params;

    try {
        const point = await Points.findById(id);
        if (!point) {
            return res.status(404).json({ message: 'Punto no encontrado' });
        }
        res.status(200).json(point);
    } catch (error) {
        console.error('Error al consultar el punto:', error);
        res.status(500).json({ message: 'Error al consultar el punto', error });
    }
};

const updatePerimeterPointById = async (req, res) => {
    const { id } = req.params;
    const { amount, type, coordinates, emitterId } = req.body;

    const updateFields = {};
    const pointFound = await Points.findById(id);

    if (!pointFound) {
        return res.status(404).json({ message: 'Punto no encontrado' });
    }
    if (!emitterId) {
        return res.status(400).json({ message: 'Envia el id del emisor de los puntos' });
    }
    if (pointFound.emitter.toString() !== emitterId) {
        return res.status(400).json({ message: 'El Usuario no es emisor de los puntos' });
    }

    if (amount !== undefined) {
        updateFields.amountCurrent = amount;
    }

    if (type) {
        updateFields['location.type'] = type;
    }

    if (coordinates) {
        if (type === 'Point') {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
            }
            updateFields['location.coordinates'] = coordinates;
        } else if (type === 'Polygon') {
            if (!Array.isArray(coordinates) || coordinates.length < 8 || coordinates.length % 2 !== 0) {
                return res.status(400).json({ message: 'Coordenadas inválidas para Polygon' });
            }
            const formattedCoordinates = [];
            for (let i = 0; i < coordinates.length; i += 2) {
                formattedCoordinates.push([coordinates[i], coordinates[i + 1]]);
            }
            if (formattedCoordinates.length < 4 || formattedCoordinates[0][0] !== formattedCoordinates[formattedCoordinates.length - 1][0] || formattedCoordinates[0][1] !== formattedCoordinates[formattedCoordinates.length - 1][1]) {
                return res.status(400).json({ message: 'El polígono debe tener al menos 4 puntos y cerrar el perímetro' });
            }
            updateFields['location.coordinates'] = [formattedCoordinates];
        }
    }

    try {
        const updatedPoint = await Points.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedPoint) {
            return res.status(404).json({ message: 'Punto no encontrado' });
        }
        res.status(200).json({ message: 'El perimetro actualizado con éxito', updatedPoint });
    } catch (error) {
        console.error('Error al actualizar el punto:', error);
        res.status(500).json({ message: 'Error al actualizar el punto', error });
    }
};

const deletePerimeterPointById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPoint = await Points.findByIdAndDelete(id);
        if (!deletedPoint) {
            return res.status(404).json({ message: 'Punto no encontrado' });
        }
        res.status(200).json({ message: 'El perimetro eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el punto:', error);
        res.status(500).json({ message: 'Error al eliminar el punto', error });
    }
};

const getPointsByUserId = async (req, res) => {
    const { userId } = req.params; // El ID del usuario se recibe como parámetro en la ruta

    try {
        // Verificar si el usuario existe en la base de datos
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar puntos cuyo campo "emitter" coincida con el ID del usuario
        const points = await Points.find({ emitter: userId });
        if (!points.length) {
            return res.status(404).json({ message: 'No se encontraron puntos para este usuario' });
        }

        // Retornar los puntos encontrados
        res.status(200).json(points);
    } catch (error) {
        console.error('Error al consultar los puntos por usuario:', error);
        res.status(500).json({ message: 'Error al consultar los puntos', error });
    }
};

module.exports = {
    createPerimeterPoints,
    getPerimeterPoints,
    getPerimeterPointById,
    updatePerimeterPointById,
    deletePerimeterPointById,
    getPointsByUserId
};
