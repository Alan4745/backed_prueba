const express = require('express');
const controllerConversation = require('../controllers/conversations.controller');
const md_autenticacion = require('../middlewares/authentication');

const api = express.Router();

api.post('/saveConversation/:receiverId', [md_autenticacion.Auth], controllerConversation.NewConversation);
api.get('/ViewConversationUser/:receiverId', [md_autenticacion.Auth], controllerConversation.ConversationIdUser);
api.get('/ConversationView', [md_autenticacion.Auth], controllerConversation.ConversationView);

module.exports = api;
