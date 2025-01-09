const express = require("express");
const { createPerimeterPoints,
        getPerimeterPoints,
        getPerimeterPointById,
        updatePerimeterPointById,
        deletePerimeterPointById,
        getPointsByUserId
    } = require("../../controllers/points/points.controller");
const { createPointsRedeemed,
        getPointsRedeemed,
        getPointsRedeemedById,
        getPerimeterPointsByUserId,
        deletePointRedeemedById } = require("../../controllers/points/pointsReemed.controller");
const { createPointsMarked,
        getAllPointsMarked,
        getPointMarkedById,
        updatePointMarkedById,
        deletePointMarkedById } = require("../../controllers/points/pointsMarked.controller");
const { createPerimeterAndDistributePoints } = require("../../controllers/points/pointsRandomPerimeter.controller");
const { pointsDetectByKmRadius } = require("../../controllers/points/pointsDetectByKmRadius.controller");
const api = express.Router();

// Ruta para filtrar puntos por el ID del usuario
api.get('/getPerimeterPointsByCurrentUbication/:userId', getPerimeterPointsByUserId);
api.get('/getPointsByUser/:userId', getPointsByUserId);

// Rutas para obtener puntos por un radio de 500Km
api.post('/getPerimeterPointsByCurrentUbication', pointsDetectByKmRadius)

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
