const { PointsMarked } = require('../../models/points/pointsMarked.model');
const { verifyRedemption } = require('../../funcs/verifyRedemption');

const notiPointsForNearbyLocation = async (req, res) => {
    try {
        const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
        console.log(coordinates)
        if (!coordinates || coordinates.length !== 2) {
          return res.status(400).json({ success: false, message: 'Coordenadas no válidas' });
        }
    
        // Obtener todos los puntos sin aplicar filtro de distancia
        const allPoints = await PointsMarked.find();
    
        // Verificar cada punto para determinar si está dentro del radio de 500 km (500,000 metros)
        const radiusInMeters = 500;
    
        // Filtrar los puntos que están dentro del radio usando la función verifyRedemption
        const pointsFound = await Promise.all(
          allPoints.map(async (point) => {
            const verificationResult = await verifyRedemption(point, coordinates, radiusInMeters);
            // Retornar solo los puntos que están dentro del radio
            if (verificationResult.success) {
              return point;
            }
            return null; // Si el punto no está dentro del radio, retorna null
          })
        );
        // Filtrar los null para obtener solo los puntos válidos
        const filteredPoints = pointsFound.filter((point) => point !== null);
    
        // Si no se encontraron puntos dentro del radio
        if (!filteredPoints.length) {
          return res.status(404).json({
            success: false,
            message: 'No se encontraron puntos dentro de los 500 metros de radio.',
          });
        }

        //Cuantos puntos se encontraron cerca del radio
        const pointsNearbyLocation = filteredPoints.length;
        const message = pointsNearbyLocation.length == 1 
        ? `Tienes un punto cerca de tu ubicacion, alrededor de 500 metros de radio.` 
        : `Tienes unos ${pointsNearbyLocation} puntos cerca de tu ubicacion, alrededor de 500 metros de radio`

        return res.status(200).json({ success: true, pointsNearbyLocation: message });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al buscar puntos en el radio especificado, para notificaciones' });
      }
}

module.exports = { notiPointsForNearbyLocation }