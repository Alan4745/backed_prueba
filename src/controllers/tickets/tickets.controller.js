const { PointsRedeemed } = require('../../models/points/pointsRedeemed.model');
const { Tickets } = require('../../models/tickets/tickets.model');
const { TicketsRedeemed } = require('../../models/tickets/ticketsRedeemed.model');
const userModel = require("../../models/user.model");
const createPerimeterTickets = async (req, res) => {
    const { amount, type, coordinates, emitterId, membership, collectionName, price  } = req.body;
    console.log(req.body)
    if (!amount || !type || !coordinates || !emitterId || !membership || !collectionName || !price) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Validación para 'Point'
    if (type === 'Point') {
        if (!Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
            return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
        }
    }

    try {
        const newTicket = new Tickets({
            amountCurrent: amount,
            amountInitial: amount,
            collectionName: collectionName,
            membership: membership,
            price: price,
            amount: amount,
            location: {
                type,
                coordinates: type === 'Polygon' ? coordinates : coordinates
            },
            emitter: emitterId
        });

        await newTicket.save();
        res.status(201).json({ message: 'Perimetro de ticket creado con éxito', ticket: newTicket });
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        res.status(500).json({ message: 'Error al crear el ticket', error });
    }
};


const getPerimeterTickets = async (req, res) => {
    try {
        const perimeterTickets = await Tickets.find();
        res.status(200).json(perimeterTickets);
    } catch (error) {
        console.error('Error al consultar los puntos:', error);
        res.status(500).json({ message: 'Error al consultar los puntos', error });
    }
};

const getTicketsByUserId = async (req, res) => {
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

const getPerimeterTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Tickets.findById(id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.status(200).json(point);
    } catch (error) {
        console.error('Error al consultar el punto:', error);
        res.status(500).json({ message: 'Error al consultar el punto', error });
    }
};

const updatePerimeterTicketById = async (req, res) => {
    const { id } = req.params;
    const { amount, type, coordinates, emitterId } = req.body;

    const updateFields = {};
    const ticketFound = await Tickets.findById(id);

    if (!ticketFound) {
        return res.status(404).json({ message: 'Ticket no encontrado' });
    }
    if (!emitterId) {
        return res.status(400).json({ message: 'Envia el id del emisor de los tickets' });
    }
    if (ticketFound.emitter.toString() !== emitterId) {
        return res.status(400).json({ message: 'El Usuario no es emisor de los tickets' });
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
                return res.status(400).json({ message: 'Coordenadas inválidas para Tickets' });
            }
            updateFields['location.coordinates'] = coordinates;
        } else if (type === 'Polygon') {
            if (!Array.isArray(coordinates) || coordinates.length < 8 || coordinates.length % 2 !== 0) {
                return res.status(400).json({ message: 'Coordenadas inválidas para Tickets' });
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
        const updatedTicket = await Tickets.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.status(200).json({ message: 'El perimetro actualizado con éxito', updatedTicket });
    } catch (error) {
        console.error('Error al actualizar el punto:', error);
        res.status(500).json({ message: 'Error al actualizar el punto', error });
    }
};

const deletePerimeterTicketById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTicket = await Tickets.findByIdAndDelete(id);
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket no encontrado' });
        }
        res.status(200).json({ message: 'El perimetro eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el punto:', error);
        res.status(500).json({ message: 'Error al eliminar el punto', error });
    }
};

module.exports = {
    createPerimeterTickets,
    getPerimeterTickets,
    getPerimeterTicketById,
    updatePerimeterTicketById,
    deletePerimeterTicketById,
    getTicketsByUserId
};
