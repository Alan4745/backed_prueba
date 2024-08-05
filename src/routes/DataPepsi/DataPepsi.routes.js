const express = require("express");
const controllerRegistrarData = require("../../controllers/DataPepsi/DataPepsi.controller");

const api = express.Router();

api.post("/RegistrarData", controllerRegistrarData.RegistrarData);

module.exports = api;
