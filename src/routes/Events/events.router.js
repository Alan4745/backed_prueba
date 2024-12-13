
const express = require('express');
const md_autenticacion = require('../../middlewares/authentication');
const {
    createEvent,
} = require("../../controllers/Events/createEvents");
const {
    getEventsByUser,
} = require("../../controllers/Events/getEventsByUser");

const {
    getReceivedEventsByUser,
} = require("../../controllers/Events/getReceivedEventsByUser");

const api = express.Router();
api.post("/createEvent", createEvent);
api.get(
    "/getSentEventsByUser/:userId",
    getEventsByUser
);
api.get(
    "/getReceivedEventByUser/:userId",
    getReceivedEventsByUser
);

module.exports = api;
