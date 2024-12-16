const { TicketsMarked } = require("../../models/tickets/ticketsMarked.model");
const { verifyRedemption } = require("../../funcs/verifyRedemption");

const ticketsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
    if (!coordinates || coordinates.length !== 2) {
      return res
        .status(400)
        .json({ success: false, message: "Coordenadas no válidas" });
    }

    // Obtener todos los tickets sin aplicar filtro de distancia
    const allTickets = await TicketsMarked.find();

    // Verificar cada tickets para determinar si está dentro del radio de 15 km (15,000 metros)
    const radiusInMeters = 15 * 1000;

    // Filtrar los tickets que están dentro del radio usando la función verifyRedemption
    const ticketsFound = await Promise.all(
      allTickets.map(async (point) => {
        const verificationResult = await verifyRedemption(
          point,
          coordinates,
          radiusInMeters
        );
        // Retornar solo los tickets que están dentro del radio
        if (verificationResult.success) {
          return point;
        }
        return null; // Si el tickets no está dentro del radio, retorna null
      })
    );
    // Filtrar los null para obtener solo los tickets válidos
    const filteredTickets = ticketsFound.filter((ticket) => ticket !== null);

    // Si no se encontraron tickets dentro del radio
    if (!filteredTickets.length) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron tickets dentro del radio especificado",
      });
    }

    return res
      .status(200)
      .json({ success: true, ticketsFound: filteredTickets });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al buscar tickets en el radio especificado",
    });
  }
};

module.exports = { ticketsDetectByKmRadius };
