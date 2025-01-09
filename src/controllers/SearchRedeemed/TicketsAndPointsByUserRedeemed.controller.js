const { PointsRedeemed } = require('../../models/points/pointsRedeemed.model');
const { TicketsRedeemed } = require('../../models/tickets/ticketsRedeemed.model');
const userModel = require("../../models/user.model");
const TicketsAndPointsByUserRedeemed = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const ticketsFounds = await TicketsRedeemed.find({ receiver: userId });
        const pointsFounds = await PointsRedeemed.find({ receiver: userId });
        const ticketsCant = ticketsFounds.length;
        const pointsCant = pointsFounds.length;
        res.status(200).json({ ticketsCant, ticketsFounds, pointsCant, pointsFounds });
    } catch (error) {
        console.error('Error al consultar los puntos:', error);
        res.status(500).json({ message: 'Error al consultar los puntos', error });
    }
};
module.exports = {
    TicketsAndPointsByUserRedeemed
};
