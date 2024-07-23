const express = require("express");
const { createPerimeterPoints, getPerimeterPoints } = require("../../controllers/points/points.controller");
const api = express.Router();

api.get('/getPerimeterPoints', getPerimeterPoints)
api.post('/createPerimeterPoints', createPerimeterPoints)

module.exports = api