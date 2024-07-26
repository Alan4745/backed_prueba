const express = require("express");
const { createPerimeterPoints, getPerimeterPoints } = require("../../controllers/points/points.controller");
const { createPointsRedeemed, getPointsRedeemed } = require("../../controllers/points/pointsReemed.controller");
const { createPointsMarked, getAllPointsMarked } = require("../../controllers/points/pointsMarked.controller");
const api = express.Router();

// Rutas para emitir puntos
api.get('/getPerimeterPoints', getPerimeterPoints)
api.post('/createPerimeterPoints', createPerimeterPoints)

// Rutas para marcar puntos
api.get('/getMarkedPoints', getAllPointsMarked)
api.post('/createMarkedPoints', createPointsMarked)

// Rutas para canjear puntos
api.get('/getPointsRedeemed', getPointsRedeemed)
api.post('/createPointsRedeemed', createPointsRedeemed)

module.exports = api