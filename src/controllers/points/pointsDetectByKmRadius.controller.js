const { PointsMarked } = require("../../models/points/pointsMarked.model");
const { verifyRedemption } = require("../../funcs/verifyRedemption");

const pointsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body; // Las coordenadas llegan por el req.body como [latitud, longitud]
    if (!coordinates || coordinates.length !== 2) {
      return res
        .status(400)
        .json({ success: false, message: "Coordenadas no válidas" });
    }

    // Obtener todos los puntos sin aplicar filtro de distancia
    const allPoints = await PointsMarked.find();

    // Verificar cada punto para determinar si está dentro del radio de 15 km (15,000 metros)
    const radiusInMeters = 15 * 1000;

    // Filtrar los puntos que están dentro del radio usando la función verifyRedemption
    const pointsFound = await Promise.all(
      allPoints.map(async (point) => {
        const verificationResult = await verifyRedemption(
          point,
          coordinates,
          radiusInMeters
        );
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
        message: "No se encontraron puntos dentro del radio especificado",
      });
    }

    return res.status(200).json({ success: true, pointsFound: filteredPoints });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al buscar puntos en el radio especificado",
    });
  }
};

module.exports = { pointsDetectByKmRadius };
