const express = require("express");
const controllerRegistrarData = require("../../controllers/adrenalineData/adrenalineData.controller");

const api = express.Router();

api.post("/RegistrarData", controllerRegistrarData.RegistrarData);
api.post("/promedio", controllerRegistrarData.obtenerPromedioTickets);

module.exports = api;
