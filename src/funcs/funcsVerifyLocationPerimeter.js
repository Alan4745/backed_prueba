const { Points } = require('../models/points/points.model');

const verifyLocationPerimeter = async (pointsFounds, coordinates) => {
    if (!pointsFounds) {
        return false;
    }

    let isWithin = false;

    if (pointsFounds.location.type === 'Point') {
        const [lng, lat] = pointsFounds.location.coordinates;
        const radiusInRadians = pointsFounds.radius / 6378100; // Convert radius to radians (radius in meters / Earth's radius in meters)

        // MongoDB query to check if the user location is within the radius
        const nearbyPoints = await Points.find({
            _id: pointsFounds._id,
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, lat], radiusInRadians]
                }
            }
        });

        isWithin = nearbyPoints.length > 0;
    } else if (pointsFounds.location.type === 'Polygon') {
        // MongoDB query to check if the user location is within the polygon
        const polygonPoints = await Points.find({
            _id: pointsFounds._id,
            location: {
                $geoIntersects: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    }
                }
            }
        });

        isWithin = polygonPoints.length > 0;
    }

    return isWithin;
};

module.exports = { verifyLocationPerimeter };
