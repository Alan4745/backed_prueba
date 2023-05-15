const express = require('express');
const controllerToken = require('../controllers/token.controller');

const md_autenticacion = require('../middlewares/authentication');

// poder usar la rutas.
const api = express.Router();

const cobro_ticket_controller = require('../controllers/tickets/cobrar_ticket');

// metodos Get
api.get('/obtenerTokens', [md_autenticacion.Auth], controllerToken.viewToken);

// metodos Post
api.post('/agregarTokenAColecion', [md_autenticacion.Auth], controllerToken.agregarTokenAColecion);
api.post('/createCollection', [md_autenticacion.Auth], controllerToken.createCollection);
api.post('/tokensSolo', [md_autenticacion.Auth], controllerToken.tokensSolos);
// metodos Put

// metodos Delete



//COBRAR TICKET A LAS PERSONAS 
api.put('/cobrar/:ticket_id', cobro_ticket_controller.cobrar);

module.exports = api;
