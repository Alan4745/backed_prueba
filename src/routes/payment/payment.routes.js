const express = require('express');
const controllerPaymet = require('../../controllers/payment_controller/payment');

const api = express.Router();

api.post('/payment-sheet', controllerPaymet.paymentTest);

module.exports = api;
