const express = require("express");
const { createPerimeterPoints } = require("../../controllers/points/points.controller");
const api = express.Router();

api.get('/getPerimeterPoints', (req, res) => {
    res.send(`<h1>Hola Mundo, Perimetro<h1/>`)
})
api.post('/createPerimeterPoints', createPerimeterPoints)

module.exports = api