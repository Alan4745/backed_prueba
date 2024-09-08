const { TicketsMarked } = require('../../models/tickets/ticketsMarked.model');
const { verifyRedemption } = require('../../funcs/verifyRedemption');

const notiTicketsForNearbyLocation = async (req, res) => {
  try {
    const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ success: false, message: 'Coordenadas no válidas' });
    }

    // Obtener todos los tickets sin aplicar filtro de distancia
    const allTickets = await TicketsMarked.find();

    // Verificar cada punto para determinar si está dentro del radio de 500 km (500,000 metros)
    const radiusInMeters = 500;

    // Filtrar los tickets que están dentro del radio usando la función verifyRedemption
    const ticketsFound = await Promise.all(
      allTickets.map(async (point) => {
        const verificationResult = await verifyRedemption(point, coordinates, radiusInMeters);
        // Retornar solo los puntos que están dentro del radio
        if (verificationResult.success) {
          return point;
        }
        return null; // Si el ticket no está dentro del radio, retorna null
      })
    );
    // Filtrar los null para obtener solo los puntos válidos
    const filteredTickets = ticketsFound.filter((ticket) => ticket !== null);
    
    // Si no se encontraron puntos dentro del radio
    if (!filteredTickets.length) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron tickets dentro de los 500 metros radio.',
      });
    }

    //Cuantos tickets se encontraron cerca del radio
    const ticketsNearbyLocation = filteredTickets.length;
    const message = ticketsNearbyLocation.length == 1 
    ? `Tienes un ticket cerca de tu ubicacion, alrededor de 500 metros de radio.` 
    : `Tienes unos ${ticketsNearbyLocation} tickets cerca de tu ubicacion, alrededor de 500 metros de radio`
    
    return res.status(200).json({ success: true, ticketsNearbyLocation: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error al buscar tickets en el radio especificado' });
  }
};

module.exports = { notiTicketsForNearbyLocation };
