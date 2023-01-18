/* eslint-disable linebreak-style */
/* eslint-disable camelcase */

const express = require('express');
const controllerMessageChannel = require('../controllers/messagesChannel.controller');
const md_autenticacion = require('../middlewares/authentication');

const api = express.Router();

api.post('/sendMessageChannel/:channelId', [md_autenticacion.Auth], controllerMessageChannel.saveMessagesChannel);

api.get('/viewMessageChannel/:channelId', [md_autenticacion.Auth], controllerMessageChannel.viewMessagesChannel);

module.exports = api;
