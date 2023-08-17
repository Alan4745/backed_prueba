const express = require('express');
const cobro = require('../controllers/payment_controller/pago.controller');


// poder usar la rutas.
const api = express.Router();


api.post('/checkout',cobro.pago);

module.exports = api;