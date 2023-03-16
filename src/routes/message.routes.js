const express = require('express');
const controllerMessage = require('../controllers/message.controller');
const md_autenticacion = require('../middlewares/authentication');

const api = express.Router();

api.post('/sendMessage/:receiverId', [md_autenticacion.Auth], controllerMessage.SaveMessage);
api.get('/messagesUser/:receiverId', [md_autenticacion.Auth], controllerMessage.ViewMessage);

module.exports = api;
