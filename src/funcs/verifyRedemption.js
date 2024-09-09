const verifyRedemption = async (pointsFounds, coordinates, radius) => {
    if (pointsFounds.redeemed) {
        return { success: false, message: 'El punto o ticket ya ha sido canjeado' };
    }
    
    const [longitude1, latitude1] = pointsFounds.location.coordinates;
    const [latitude2, longitude2] = coordinates;

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const earthRadiusMeters = 6371000; // Radio de la Tierra en metros

    const deltaLat = toRadians(latitude2 - latitude1);
    const deltaLon = toRadians(longitude2 - longitude1);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) *
        Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusMeters * c;

    // Verificar si la distancia es menor o igual a 10 metros
    if (distance <= radius) {
        return { success: true };
    } else {
        return { success: false, message: `La ubicación no está dentro del radio de ${radius} metros del marcador` };
    }
};

module.exports = { verifyRedemption };