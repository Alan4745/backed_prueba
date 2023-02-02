/* eslint-disable camelcase */
const express = require('express');
const controllerToken = require('../controllers/token.controller');

const md_autenticacion = require('../middlewares/authentication');

// poder usar la rutas.
const api = express.Router();

// metodos Get
api.get('/obtenerTokens', [md_autenticacion.Auth], controllerToken.viewToken);

// metodos Post
api.post('/agregarTokenAColecion', [md_autenticacion.Auth], controllerToken.agregarTokenAColecion);
api.post('/createCollection', [md_autenticacion.Auth], controllerToken.createCollection);
api.post('/tokensSolo', [md_autenticacion.Auth], controllerToken.tokensSolos);
// metodos Put

// metodos Delete

module.exports = api;
