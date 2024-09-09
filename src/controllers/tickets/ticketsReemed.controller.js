const { TicketsMarked } = require('../../models/tickets/ticketsMarked.model');
const { TicketsRedeemed } = require('../../models/tickets/ticketsRedeemed.model');
const { verifyRedemption } = require('../../funcs/verifyRedemption');

const createTicketsRedeemed = async (req, res) => {
    const { coordinates, idTicketsMarked, receiver } = req.body;

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
        const ticketsFounds = await TicketsMarked.findById(idTicketsMarked);
        if (!ticketsFounds) {
            return res.status(404).json({ message: 'No se encontraron los tickets' });
        }

        // Verificar si la ubicación está dentro del marcador y si no ha sido canjeado
        const canRedeem = await verifyRedemption(ticketsFounds, coordinates, 10);
        if (!canRedeem.success) {
            return res.status(400).json({ message: canRedeem.message });
        }
        
        // // Marcar como canjeado
        ticketsFounds.redeemed = true;
        const amountInitial = ticketsFounds.amountTicketsMarked;
        ticketsFounds.amountTicketsMarked -= amountInitial;
        await ticketsFounds.save();
        
        // Registrar los puntos canjeados
        const newTicketsRedeemed = new TicketsRedeemed({
            amountRedeemed: amountInitial,
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            idTicketsMarked: ticketsFounds._id,
            receiver,
        });
        await newTicketsRedeemed.save();       

        res.status(201).json({ message: 'Tickets canjeados con éxito', newTicketsRedeemed });
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        res.status(500).json({ message: 'Error al crear el ticket', error });
    }
};

const getTicketsRedeemed = async (req, res) => {
    try {
        const ticketsRedeemed = await TicketsRedeemed.find();
        res.status(200).json(ticketsRedeemed);
    } catch (error) {
        console.error('Error al canjear:', error);
        res.status(500).json({ message: 'Error al canjear:', error });
    }
};

const getTicketsRedeemedById = async (req, res) => {
    const { id } = req.params;
    try {
        const ticket = await TicketsRedeemed.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error al consultar el ticket:', error);
        res.status(500).json({ message: 'Error al consultar el ticket', error });
    }
};

const deleteTicketsRedeemedById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTicket = await TicketsRedeemed.findByIdAndDelete(id);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Tickets no encontrados' });
        }
        res.status(200).json({ message: 'Tickets eliminados con éxito' });
    } catch (error) {
        console.error('Error al eliminar el ticket:', error);
        res.status(500).json({ message: 'Error al eliminar el ticket', error });
    }
};

module.exports = {
    createTicketsRedeemed,
    getTicketsRedeemed,
    getTicketsRedeemedById,
    deleteTicketsRedeemedById
};
