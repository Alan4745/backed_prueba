const express = require("express");
const { createPerimeterPoints, 
        getPerimeterPoints, 
        getPerimeterPointById, 
        updatePerimeterPointById, 
        deletePerimeterPointById,
    } = require("../../controllers/points/points.controller");
const { createPointsRedeemed, 
        getPointsRedeemed, 
        getPointsRedeemedById, 
        deletePointRedeemedById } = require("../../controllers/points/pointsReemed.controller");
const { createPointsMarked, 
        getAllPointsMarked, 
        getPointMarkedById, 
        updatePointMarkedById, 
        deletePointMarkedById } = require("../../controllers/points/pointsMarked.controller");
const { createPerimeterAndDistributePoints } = require("../../controllers/points/pointsRandomPerimeter.controller");
const api = express.Router();

// Rutas para emitir puntos
api.get('/getPerimeterPoints', getPerimeterPoints)
api.get('/getPerimeterPoints/:id', getPerimeterPointById)
api.post('/createPerimeterPoints', createPerimeterPoints)
api.post('/createPerimeterAndDistributePoints', createPerimeterAndDistributePoints)
api.put('/updatePerimeterPointsById/:id', updatePerimeterPointById)
api.delete('/deletePerimeterPointById/:id', deletePerimeterPointById)

// Rutas para marcar puntos
api.get('/getAllPointsMarked', getAllPointsMarked)
api.get('/getMarkedPoints/:id', getPointMarkedById)
api.post('/createMarkedPoints', createPointsMarked)
api.put('/updatePointsMarkedById/:id', updatePointMarkedById)
api.delete('/deletePointsMarkedById/:id', deletePointMarkedById)

// Rutas para canjear puntos
api.get('/getPointsRedeemed', getPointsRedeemed)
api.get('/getPointsRedeemed/:id', getPointsRedeemedById)
api.post('/createPointsRedeemed', createPointsRedeemed)
api.delete('/deletePointsRedeemedById/:id', deletePointRedeemedById)

module.exports = api