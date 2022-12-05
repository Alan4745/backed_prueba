const express = require('express');
const controllerMessage = require('../controllers/message.controller');


const api = express.Router();


api.post('/save', controllerMessage.SaveMessage);
api.get('/messages', controllerMessage.ViewMessage);

module.exports = api;