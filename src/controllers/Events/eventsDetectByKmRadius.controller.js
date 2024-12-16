const { Events } = require("../../models/events/events.model");
const { verifyRedemption } = require("../../funcs/verifyRedemption");

const eventsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
    if (!coordinates || coordinates.length !== 2) {
      return res
        .status(400)
        .json({ success: false, message: "Coordenadas no válidas" });
    }

    // Obtener todos los eventos sin aplicar filtro de distancia
    const allEvents = await Events.find();

    // Verificar cada tickets para determinar si está dentro del radio de 15 km (500,000 metros)
    const radiusInMeters = 15 * 1000;

    // Filtrar los eventos que están dentro del radio usando la función verifyRedemption
    const eventsFound = await Promise.all(
      allEvents.map(async (point) => {
        const verificationResult = await verifyRedemption(
          point,
          coordinates,
          radiusInMeters
        );
        // Retornar solo los events que están dentro del radio
        if (verificationResult.success) {
          return point;
        }
        return null; // Si el events no está dentro del radio, retorna null
      })
    );
    // Filtrar los null para obtener solo los events válidos
    const filteredTickets = eventsFound.filter((ticket) => ticket !== null);

    // Si no se encontraron events dentro del radio
    if (!filteredTickets.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron eventos dentro del radio especificado",
      });
    }

    return res
      .status(200)
      .json({ success: true, eventsFound: filteredTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al buscar eventos en el radio especificado",
    });
  }
};

module.exports = { eventsDetectByKmRadius };
