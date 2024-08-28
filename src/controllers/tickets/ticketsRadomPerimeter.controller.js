const { Tickets } = require('../../models/tickets/tickets.model');
const { TicketsMarked } = require('../../models/tickets/ticketsMarked.model');
const turf = require('@turf/turf'); // Para cálculos de geolocalización
const { getRandomNumberInRange } = require('../../funcs/getRandomNumberInRange');

const createPerimeterAndDistributeTickets = async (req, res) => {
    const { amount, type, coordinates, emitterId } = req.body;

    if (!amount || !type || !coordinates || !emitterId) {
        return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Validación de coordenadas para Point
    if (type === 'Point') {
        if (!Array.isArray(coordinates) || coordinates.length !== 2 || !coordinates.every(coord => typeof coord === 'number')) {
            return res.status(400).json({ message: 'Coordenadas inválidas para Point' });
        }
    }

    try {
        // Crear el perímetro
        const newPerimeter = new Tickets({
            amountCurrent: amount,
            amountInitial: amount,
            location: {
                type,
                coordinates
            },
            emitter: emitterId
        });

        await newPerimeter.save();

        // Distribuir los puntos aleatoriamente dentro del perímetro
        if (type === 'Polygon') {
            const polygon = turf.polygon(coordinates); // Crear el polígono usando @turf
            let remainingAmount = amount; // Monto restante a distribuir
            const generatedTickets = [];

            while (remainingAmount > 0) {
                let ticket = null;
                do {
                    // Generar un ticket aleatorio dentro del polígono
                    const randomTicket = turf.randomPoint(1, { bbox: turf.bbox(polygon) });
                    ticket = randomTicket.features[0].geometry.coordinates;
                } while (!turf.booleanPointInPolygon(ticket, polygon));

                generatedTickets.push(ticket);

                // Generar un valor aleatorio para amountPointsMarked
                const ticketCount = getRandomNumberInRange(remainingAmount);

                // Si el ticketCount es mayor que el remainingAmount, ajustarlo
                const amountTicketsMarked = ticketCount > remainingAmount ? remainingAmount : ticketCount;

                // Restar el monto asignado del monto restante
                remainingAmount -= amountTicketsMarked;

                // Crear el ticket marcado
                const ticketMarked = new TicketsMarked({
                    amountTicketsMarked,
                    location: {
                        type: 'Point',
                        coordinates: ticket
                    },
                    idTickets: newPerimeter._id,
                    redeemed: false
                });

                await ticketMarked.save();
            }
        } else if (type === 'Point') {
            // Crear un único punto marcado si el tipo es Point
            const ticketMarked = new TicketsMarked({
                amountTicketsMarked: amount,
                location: {
                    type: 'Point',
                    coordinates
                },
                idTickets: newPerimeter._id,
                redeemed: false
            });

            await ticketMarked.save();
        }

        res.status(201).json({ message: 'Perímetro creado y puntos distribuidos con éxito', perimeter: newPerimeter });
    } catch (error) {
        console.error('Error al crear el perímetro y distribuir puntos:', error);
        res.status(500).json({ message: 'Error al crear el perímetro y distribuir puntos', error });
    }
};

module.exports = {
    createPerimeterAndDistributeTickets
}
