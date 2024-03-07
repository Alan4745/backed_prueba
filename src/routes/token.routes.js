const express = require('express');
const controllerToken = require('../controllers/token.controller');

const md_autenticacion = require('../middlewares/authentication');

// poder usar la rutas.
const api = express.Router();

const cobro_ticket_controller = require('../controllers/tickets/cobrar_ticket');

// metodos Get
api.get('/obtenerToken/:idCollection', [md_autenticacion.Auth], controllerToken.viewToken); // metodo actualizado 🆗
api.get('/getcollections/:name', [md_autenticacion.Auth], controllerToken.findCollectionByName); // metodo actualizado 🆗

// metodos Post
api.post('/addTokenToCollection', [md_autenticacion.Auth], controllerToken.addTokenToCollection); // metodo actualizado 🆗
api.post('/createCollection', [md_autenticacion.Auth], controllerToken.createCollection); // metodo actualizado 🆗
api.post('/tokensSolo', [md_autenticacion.Auth], controllerToken.tokensSolos); // metodo no actualizado ❌  
// metodos Put
api.put('/redeemTiceket/:idTicket', [md_autenticacion.Auth], controllerToken.redeemTicket); // metodo actualizado 🆗
// metodos Delete



//COBRAR TICKET A LAS PERSONAS 
api.put('/cobrar/:ticket_id', cobro_ticket_controller.cobrar); // metodo actualizado 🆗

module.exports = api;
