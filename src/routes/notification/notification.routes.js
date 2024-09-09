const express = require('express');
const { notiPointsForNearbyLocation } = require('../../controllers/notification/notiPointsForNearbyLocation.controller');
const { notiTicketsForNearbyLocation } = require('../../controllers/notification/notiTicketsForNearbyLocation.controller');
const api = express.Router();

// Notificaciones de puntos por ubicacion cercana a un punto
api.post('/notiPointsForNearbyLocation', notiPointsForNearbyLocation)
api.post('/notiTicketsForNearbyLocation', notiTicketsForNearbyLocation)

module.exports = api