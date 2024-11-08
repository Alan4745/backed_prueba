const calculateDistance = (coords1, coords2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const earthRadiusMeters = 6371000; // Radio de la Tierra en metros
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const deltaLat = toRadians(lat2 - lat1);
    const deltaLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(deltaLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusMeters * c;

    return distance; // Retorna la distancia en metros
};

module.exports = { calculateDistance }