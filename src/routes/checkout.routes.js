const express = require('express');
const controllerToken = require('../controllers/token.controller');


// poder usar la rutas.
const api = express.Router();

const cobro = require('../controllers/payment_controller/pago.controller');

api.post('/checkout',cobro.pago);

module.exports = api;