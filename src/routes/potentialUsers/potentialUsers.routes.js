const express = require("express");
const controllerpotentialUsers = require("../../controllers/potentialUsers/PotentialUsers.controller");
const controllerAuth = require("../../middlewares/authentication");

const api = express.Router();

api.post("/fillInData", controllerpotentialUsers.createPotentialUser);

module.exports = api;
