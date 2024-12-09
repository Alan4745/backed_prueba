
const express = require('express');
const md_autenticacion = require('../../middlewares/authentication');
const {
    createEvent
} = require("../../controllers/Events/createEvents");

const api = express.Router();
api.post("/createEvent", createEvent);

module.exports = api;
