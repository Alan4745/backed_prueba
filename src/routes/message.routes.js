const express = require('express');
const controllerMessage = require('../controllers/message.controller');
const md_autenticacion = require('../middlewares/authentication');

const api = express.Router();

api.get('/messagesUser/:receiverId', [md_autenticacion.Auth], controllerMessage.ViewMessage);
api.post('/sendMessage/:receiverId', [md_autenticacion.Auth], controllerMessage.SaveMessage);
api.put('/editMessage/:messageId', [md_autenticacion.Auth], controllerMessage.EditMessage);
api.delete('/deleteMessage/:messageId', [md_autenticacion.Auth], controllerMessage.DeleteMessage);

module.exports = api;
