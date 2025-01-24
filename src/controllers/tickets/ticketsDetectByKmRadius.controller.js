const { TicketsMarked } = require("../../models/tickets/ticketsMarked.model");
const { verifyRedemption } = require("../../funcs/verifyRedemption");

const ticketsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body;
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Coordenadas no válidas"
      });
    }

    const radiusInMeters = 15 * 1000;
    const allTickets = await TicketsMarked.find();

    // Find tickets within the radius with their distances
    const ticketsWithinRadius = await Promise.all(
      allTickets.map(async (point) => {
        const verificationResult = await verifyRedemption(
          point,
          coordinates,
          radiusInMeters
        );

        return verificationResult.success
          ? {
            ticket: point,
            distance: verificationResult.distance
          }
          : null;
      })
    ).then(results =>
      results.filter(result => result !== null)
    );

    // Find the closest ticket
    if (ticketsWithinRadius.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron tickets dentro del radio especificado"
      });
    }

    const closestTicket = ticketsWithinRadius.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest
    );

    return res.status(200).json({
      success: true,
      ticketsFound: [closestTicket.ticket]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al buscar tickets en el radio especificado"
    });
  }
};

module.exports = { ticketsDetectByKmRadius };
