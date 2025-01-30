const controllerRegistrarData = require("../../controllers/pizzaCamperoData/pizzaCamperoData.controller");

const express = require("express");

const api = express.Router();

api.post("/RegistrarDataPizza", controllerRegistrarData.RegistrarData);

module.exports = api;
