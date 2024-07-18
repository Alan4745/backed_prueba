const express = require('express');
const controllerConversation = require('../controllers/conversations.controller');
const md_autenticacion = require('../middlewares/authentication');

const api = express.Router();

api.get('/ViewConversationUser/:receiverId', [md_autenticacion.Auth], controllerConversation.ConversationIdUser);
api.get('/ConversationView', [md_autenticacion.Auth], controllerConversation.ConversationView);
api.get('/ConversationByUser', [md_autenticacion.Auth], controllerConversation.ConversationByUser);
api.post('/saveConversation/:receiverId', [md_autenticacion.Auth], controllerConversation.NewConversation);
api.post('/createGroupConversation', [md_autenticacion.Auth], controllerConversation.NewConversationGroup);
api.delete('/deleteConversation/:conversationId', [md_autenticacion.Auth], controllerConversation.deleteConversation);

module.exports = api;
