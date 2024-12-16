const express = require("express");
const md_autenticacion = require("../../middlewares/authentication");
const { createEvent } = require("../../controllers/Events/createEvents");
const { getEventsByUser } = require("../../controllers/Events/getEventsByUser");

const {
  getReceivedEventsByUser,
} = require("../../controllers/Events/getReceivedEventsByUser");
const {
  eventsDetectByKmRadius,
} = require("../../controllers/Events/eventsDetectByKmRadius.controller");

const api = express.Router();
api.post("/createEvent", createEvent);
api.post("/getPerimeterEventsByCurrentUbication", eventsDetectByKmRadius);
api.get("/getSentEventsByUser/:userId", getEventsByUser);
api.get("/getReceivedEventByUser/:userId", getReceivedEventsByUser);

module.exports = api;
