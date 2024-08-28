const { Tickets } = require('../../models/tickets/tickets.model');
const { TicketsMarked } = require('../../models/tickets/ticketsMarked.model');
const userModel = require('../../models/user.model');
const { verifyLocationPerimeter } = require('../../funcs/funcsVerifyLocationPerimeter');
const { verifyRedemption } = require('../../funcs/verifyRedemption');

const createTicketMarked = async (req, res) => {
    const { amountTicketsMarked, coordinates, idTickets, idEmitter } = req.body;

    if (!amountTicketsMarked || !coordinates || !idTickets || !idEmitter) {
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
        const ticketsFounds = await Tickets.findById(idTickets);
        if (!ticketsFounds) {
            return res.status(404).json({ message: 'No se encontraron los puntos' });
        }

        // Verificar al emisor
        if (ticketsFounds.emitter.toString() !== idEmitter) {
            return res.status(400).json({ message: 'El marcador no es el emisor de los puntos' });
        }

        // Verificar si hay suficientes puntos
        if (ticketsFounds.amountCurrent < amountTicketsMarked) {
            return res.status(400).json({ message: 'No hay suficientes puntos para marcar' });
        }

        // Verificar la ubicación del perímetro
        if(ticketsFounds.location.type === 'Point') {
            const canRedeem = await verifyRedemption(ticketsFounds, coordinates);
            console.log(canRedeem)
            if (!canRedeem.success) {
                return res.status(400).json({ message: canRedeem.message });
            }
        }
        
        if(ticketsFounds.location.type === 'Polygon'){
            const isWithin = await verifyLocationPerimeter(ticketsFounds, [longitude, latitude]); // Enviar en el orden correcto
            if (!isWithin) {
                return res.status(400).json({ message: 'La ubicación del marcador no está dentro del perímetro' });
            }
        }
        // Restar los puntos
        ticketsFounds.amountCurrent -= amountTicketsMarked;
        await ticketsFounds.save();

        // Distribuir los puntos en el marcador
        const newTicketMarked = new TicketsMarked({
            amountTicketsMarked,
            location: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            idTickets,
            redeemed: false
        });

        await newTicketMarked.save();
        res.status(201).json({ message: 'Puntos distribuidos con éxito', newTicketMarked });
    } catch (error) {
        console.error('Error al crear un marcador:', error);
        res.status(500).json({ message: 'Error al crear marcador', error });
    }
};

const getAllTicketsMarked = async (req, res) => {
    try {
        const ticketsRedeemed = await TicketsMarked.find();
        res.status(200).json(ticketsRedeemed);
    } catch (error) {
        console.error('Error al obtener los puntos marcados:', error);
        res.status(500).json({ message: 'Error al obtener los puntos marcados', error });
    }
};

const getTicketMarkedById = async (req, res) => {
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

const updateTicketMarkedById = async (req, res) => {
    const { id } = req.params;
    const { amountTicketsMarked, coordinates, idEmitter } = req.body;

    try {
        const ticketMarked = await TicketsMarked.findById(id);
        if (!ticketMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        const tickets = await Tickets.findById(ticketMarked.idTickets.toString())
        // Verificar que el emisor que realiza la actualización es el mismo que emitió el punto
        const idEmitterFounds = tickets.emitter.toString()
        console.log(idEmitterFounds)
        if (idEmitterFounds !== idEmitter) {
            return res.status(403).json({ message: 'No tienes permiso para actualizar este punto marcado' });
        }

        const updateFields = {};
        console.log(updateFields)
        console.log(coordinates)
        if (amountTicketsMarked !== undefined) {
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
        const updatedTicketMarked = await TicketsMarked.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
        if (!updatedTicketMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        res.status(200).json({ message: 'Punto marcado actualizado con éxito', updatedTicketMarked });
    } catch (error) {
        console.error('Error al actualizar el punto marcado:', error);
        res.status(500).json({ message: 'Error al actualizar el punto marcado', error });
    }
};

const deleteTicketMarkedById = async (req, res) => {
    const { id } = req.params;
    const { idEmitter } = req.body;

    try {
        const ticketMarked = await TicketsMarked.findById(id);
        if (!ticketMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        const idTickets = ticketMarked.idTickets.toString()
        const ticket = await Tickets.findById(idTickets)
        // Verificar que el emisor que realiza la eliminación es el mismo que emitió el punto
        console.log(ticket.emitter.toString() === idEmitter)
        if (ticket.emitter.toString() !== idEmitter) {
            return res.status(403).json({ message: 'No tienes permiso para eliminar este punto marcado' });
        }
        const deletedTicketsMarked = await TicketsMarked.findByIdAndDelete(id);
        if (!deletedTicketsMarked) {
            return res.status(404).json({ message: 'Punto marcado no encontrado' });
        }
        res.status(200).json({ message: 'Punto marcado eliminado con éxito', deletedTicketsMarked });
    } catch (error) {
        console.error('Error al eliminar el punto marcado:', error);
        res.status(500).json({ message: 'Error al eliminar el punto marcado', error });
    }
};

module.exports = {
    createTicketMarked,
    getAllTicketsMarked,
    getTicketMarkedById,
    updateTicketMarkedById,
    deleteTicketMarkedById
};
