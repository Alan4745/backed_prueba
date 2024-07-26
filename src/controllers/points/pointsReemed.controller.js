const { PointsMarked } = require('../../models/points/pointsMarked.model');
const { PointsRedeemed } = require('../../models/points/pointsRedeemed.model');
const { verifyRedemption } = require('../../funcs/verifyRedemption');

const createPointsRedeemed = async (req, res) => {
    const { type, coordinates, idPointsMarked, receiver } = req.body;

    try {
        // Buscar los puntos al canjear por Id, y verificar que exista
        const pointsFounds = await PointsMarked.findById(idPointsMarked);
        if (!pointsFounds) {
            return res.status(404).json({ message: 'No se encontraron los puntos' });
        }

        // Verificar si la ubicación está dentro del marcador y si no ha sido canjeado
        const canRedeem = await verifyRedemption(pointsFounds, coordinates);
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
                type,
                coordinates
            },
            idPointsMarked: pointsFounds.idPoints,
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

module.exports = {
    createPointsRedeemed,
    getPointsRedeemed
};
