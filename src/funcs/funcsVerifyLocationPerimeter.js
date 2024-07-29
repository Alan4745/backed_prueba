const turf = require('@turf/turf');
const { Points } = require('../models/points/points.model');

/**
 * Verifica si una ubicación dada está dentro del perímetro definido por un punto o un polígono.
 * @param {Object} pointsFounds - El punto o perímetro encontrado en la base de datos.
 * @param {Array} coordinates - Las coordenadas del usuario a verificar.
 * @returns {boolean} - Verdadero si la ubicación está dentro del perímetro, falso en caso contrario.
 */
const verifyLocationPerimeter = async (pointsFounds, coordinates) => {
    if (!pointsFounds) {
        return false;
    }

    let isWithin = false;

    // console.log("Tipo de ubicación:", pointsFounds.location.type);
    // console.log("Coordenadas del perímetro:", pointsFounds.location.coordinates);
    // console.log("Coordenadas a verificar:", coordinates);

    if (pointsFounds.location.type === 'Point') {
        // En este caso, el perímetro no tiene un radio, por lo que se asume que el punto es exacto
        const [lat, lng] = pointsFounds.location.coordinates;

        // Verificar si las coordenadas dadas coinciden con el punto almacenado
        isWithin = lng === coordinates[1] && lat === coordinates[0]; // latitud primero, longitud después
    } else if (pointsFounds.location.type === 'Polygon') {
        // Convertir las coordenadas del polígono a objetos con latitude y longitude
        const polygonCoordinates = pointsFounds.location.coordinates[0].map(coord => [coord[1], coord[0]]);

        // Convertir las coordenadas del punto a un objeto con latitude y longitude
        const point = turf.point(coordinates); // El punto está en el formato [lat, lng]

        // Verificar si el punto está dentro del polígono
        const polygon = turf.polygon([polygonCoordinates]);
        isWithin = turf.booleanPointInPolygon(point, polygon);

        // console.log("Resultado de verificación:", isWithin);
    }

    return isWithin;
};

module.exports = { verifyLocationPerimeter };
