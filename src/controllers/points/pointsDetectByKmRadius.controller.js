const { PointsMarked } = require("../../models/points/pointsMarked.model");
const { verifyRedemption } = require("../../funcs/verifyRedemption");

const pointsDetectByKmRadius = async (req, res) => {
  try {
    const { coordinates } = req.body;
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Coordenadas no válidas"
      });
    }

    const radiusInMeters = 15 * 1000;
    const allPoints = await PointsMarked.find();

    // Find points within the radius with their distances
    const pointsWithinRadius = await Promise.all(
      allPoints.map(async (point) => {
        const verificationResult = await verifyRedemption(
          point,
          coordinates,
          radiusInMeters
        );

        return verificationResult.success
          ? {
            point: point,
            distance: verificationResult.distance
          }
          : null;
      })
    ).then(results =>
      results.filter(result => result !== null)
    );

    // Find the closest point
    if (pointsWithinRadius.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron puntos dentro del radio especificado"
      });
    }

    const closestPoint = pointsWithinRadius.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest
    );

    return res.status(200).json({
      success: true,
      pointsFound: [closestPoint.point]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al buscar puntos en el radio especificado"
    });
  }
};

module.exports = { pointsDetectByKmRadius };
