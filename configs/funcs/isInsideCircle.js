const { haversineDistance } = require("./haverSineDistance");

// Función para verificar si coords1 está dentro del círculo definido por coords2 y radius
const isInsideCircle = (location1, location2, radius) => {
  const coords1 = { lat: location1[0], lon: location1[1] };
  const coords2 = { lat: location2[1], lon: location2[0] };
  const distance = haversineDistance(coords1, coords2);
  return distance <= radius; // Retorna true si está dentro, false si está fuera
};

module.exports = { isInsideCircle };
