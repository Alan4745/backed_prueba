const { verifyLocationPerimeter } = require('../../funcs/funcsVerifyLocationPerimeter');
const { verifyRedemption } = require('../../funcs/verifyRedemption');
const { Points } = require('../../models/points/points.model');
const { PointsMarked } = require('../../models/points/pointsMarked.model');
const userModel = require('../../models/user.model');

const createPointsMarked = async (req, res) => {
    const { amountPointsMarked, coordinates, idPoints, idEmitter } = req.body;

    if (!amountPointsMarked || !coordinates || !idPoints || !idEmitter) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    try {
        // Asegurarse de que las coordenadas están en el formato correcto [latitud, longitud]
        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ message: 'Coordenadas inválidas' });
        }

        // Verificar que la latitud y la longitud están en los rangos correctos
        const [longitude, latitude] = coordinates;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ message: 'Coordenadas fuera de los límites permitidos' });
        }

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

        // Verificar la ubicación del perímetro
        if(pointsFounds.location.type === 'Point') {
            const canRedeem = await verifyRedemption(pointsFounds, coordinates);
            console.log(canRedeem)
            if (!canRedeem.success) {
                return res.status(400).json({ message: canRedeem.message });
            }
        }
        
        if(pointsFounds.location.type === 'Polygon'){
            const isWithin = await verifyLocationPerimeter(pointsFounds, [longitude, latitude]); // Enviar en el orden correcto
            if (!isWithin) {
                return res.status(400).json({ message: 'La ubicación del marcador no está dentro del perímetro' });
            }
        }
        // Restar los puntos
        pointsFounds.amountCurrent -= amountPointsMarked;
        await pointsFounds.save();

        // Distribuir los puntos en el marcador
        const newPointMarked = new PointsMarked({
            amountPointsMarked,
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
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
        console.error('Error al obtener los puntos marcados:', error);
        res.status(500).json({ message: 'Error al obtener los puntos marcados', error });
    }
};

const getPointMarkedById = async (req, res) => {
    const { id } = req.params;

    try {
        const pointMarked = await PointsMarked.findById(id);
        if (!pointMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        res.status(200).json(pointMarked);
    } catch (error) {
        console.error('Error al consultar el punto marcado:', error);
        res.status(500).json({ message: 'Error al consultar el punto marcado', error });
    }
};

const updatePointMarkedById = async (req, res) => {
    const { id } = req.params;
    const { amountPointsMarked, coordinates, idEmitter } = req.body;

    try {
        const pointMarked = await PointsMarked.findById(id);
        if (!pointMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        const points = await Points.findById(pointMarked.idPoints.toString())
        // Verificar que el emisor que realiza la actualización es el mismo que emitió el punto
        const idEmitterFounds = points.emitter.toString()
        console.log(idEmitterFounds)
        if (idEmitterFounds !== idEmitter) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este punto marcado' });
        }

        const updateFields = {};
        console.log(updateFields)
        console.log(coordinates)
        if (amountPointsMarked !== undefined) {
            return res.status(403).json({ message: 'si quieres actualizar el monto elimina el punto marcado, los puntos permaneceran en el perimetro.' });
        }
        if (coordinates !== undefined) {
            if (!Array.isArray(coordinates) || coordinates.length !== 2) {
                return res.status(400).json({ message: 'Coordenadas inválidas' });
            }
            const [latitude, longitude] = coordinates;
            const isWithin = await verifyLocationPerimeter(points, [longitude, latitude]); // Enviar en el orden correcto
            if (!isWithin) {
                return res.status(400).json({ message: 'La ubicación del marcador no está dentro del perímetro' });
            }
            updateFields['location.coordinates'] = coordinates;
        }
        const updatedPointMarked = await PointsMarked.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedPointMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        res.status(200).json({ message: 'Punto marcado actualizado con éxito', updatedPointMarked });
    } catch (error) {
        console.error('Error al actualizar el punto marcado:', error);
        res.status(500).json({ message: 'Error al actualizar el punto marcado', error });
    }
};

const deletePointMarkedById = async (req, res) => {
    const { id } = req.params;
    const { idEmitter } = req.body;

    try {
        const pointMarked = await PointsMarked.findById(id);
        if (!pointMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        const idPoints = pointMarked.idPoints.toString()
        const points = await Points.findById(idPoints)
        // Verificar que el emisor que realiza la eliminación es el mismo que emitió el punto
        console.log(points.emitter.toString() === idEmitter)
        if (points.emitter.toString() !== idEmitter) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este punto marcado' });
        }
        const deletedPointMarked = await PointsMarked.findByIdAndDelete(id);
        if (!deletedPointMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        res.status(200).json({ message: 'Punto marcado eliminado con éxito', deletedPointMarked });
    } catch (error) {
        console.error('Error al eliminar el punto marcado:', error);
        res.status(500).json({ message: 'Error al eliminar el punto marcado', error });
    }
};

module.exports = {
    createPointsMarked,
    getAllPointsMarked,
    getPointMarkedById,
    updatePointMarkedById,
    deletePointMarkedById
};
