// funcs/verifyRedemption.js
const verifyRedemption = async (pointsFounds, coordinates) => {
    if (pointsFounds.redeemed) {
        return { success: false, message: 'El punto ya ha sido canjeado' };
    }

    const [lat, lng] = pointsFounds.location.coordinates;
    const [userLat, userLng] = coordinates;

    // Verificar si el punto está dentro del marcador (se puede mejorar con una librería de geolocalización)
    const isWithin = lat === userLat && lng === userLng;
    if (!isWithin) {
        return { success: false, message: 'La ubicación no está dentro del marcador' };
    }

    return { success: true };
};

module.exports = { verifyRedemption };
