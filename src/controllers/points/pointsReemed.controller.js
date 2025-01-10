const { PointsMarked } = require('../../models/points/pointsMarked.model');
const { PointsRedeemed } = require('../../models/points/pointsRedeemed.model');
const { verifyRedemption } = require('../../funcs/verifyRedemption');
const userModel = require("../../models/user.model");

const createPointsRedeemed = async (req, res) => {
    const { type, coordinates, idPointsMarked, receiver } = req.body;

    try {
        // Asegurarse de que las coordenadas están en el formato correcto [latitud, longitud]
        if (!Array.isArray(coordinates) || coordinates.length !== 2) {
            return res.status(400).json({ message: 'Coordenadas inválidas' });
        }

        // Verificar que la latitud y la longitud están en los rangos correctos
        const [latitude, longitude] = coordinates;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ message: 'Coordenadas fuera de los límites permitidos' });
        }
        // Buscar los puntos al canjear por Id, y verificar que exista
        const pointsFounds = await PointsMarked.findById(idPointsMarked);
        if (!pointsFounds) {
            return res.status(404).json({ message: 'No se encontraron los puntos' });
        }

        // Verificar si la ubicación está dentro del marcador y si no ha sido canjeado
        const canRedeem = await verifyRedemption(pointsFounds, coordinates, 1000);
        if (!canRedeem.success) {
            return res.status(400).json({ message: canRedeem.message });
        }

        // // Marcar como canjeado
        pointsFounds.redeemed = true;
        const amountInitial = pointsFounds.amountPointsMarked;
        pointsFounds.amountPointsMarked -= amountInitial;
        await pointsFounds.save();

        // Registrar los puntos canjeados
        const newPointsRedeemed = new PointsRedeemed({
            amountRedeemed: amountInitial,
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            idPointsMarked: pointsFounds._id,
            collectionName: pointsFounds.collectionName,
            receiver,
        });
        await newPointsRedeemed.save();


        res.status(201).json({ message: 'Puntos canjeados con éxito', newPointsRedeemed });
    } catch (error) {
        console.error('Error al crear el punto:', error);
        res.status(500).json({ message: 'Error al crear el punto', error });
    }
};

const getPointsRedeemed = async (req, res) => {
    try {
        const pointsRedeemed = await PointsRedeemed.find();
        res.status(200).json(pointsRedeemed);
    } catch (error) {
        console.error('Error al canjear:', error);
        res.status(500).json({ message: 'Error al canjear:', error });
    }
};

const getPointsRedeemedById = async (req, res) => {
    const { id } = req.params;

    try {
        const point = await PointsRedeemed.findById(id);
        if (!point) {
            return res.status(404).json({ message: 'Punto no encontrado' });
        }
        res.status(200).json(point);
    } catch (error) {
        console.error('Error al consultar el punto:', error);
        res.status(500).json({ message: 'Error al consultar el punto', error });
    }
};

const deletePointRedeemedById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPoint = await PointsRedeemed.findByIdAndDelete(id);
        if (!deletedPoint) {
            return res.status(404).json({ message: 'Puntos no encontrados' });
        }
        res.status(200).json({ message: 'Puntos eliminados con éxito' });
    } catch (error) {
        console.error('Error al eliminar el punto:', error);
        res.status(500).json({ message: 'Error al eliminar el punto', error });
    }
};

const getPerimeterPointsByUserId = async (req, res) => {
    const { userId } = req.params; // El ID del usuario se recibe como parámetro en la ruta

    try {
        // Verificar si el usuario existe en la base de datos
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscar puntos cuyo campo "emitter" coincida con el ID del usuario
        const points = await PointsRedeemed.find({ emitter: userId });
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
    createPointsRedeemed,
    getPointsRedeemed,
    getPointsRedeemedById,
    deletePointRedeemedById,
    getPerimeterPointsByUserId
};
