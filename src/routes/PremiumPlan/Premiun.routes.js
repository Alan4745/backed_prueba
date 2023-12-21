const express = require('express');
// Estas son las rutas de plan FREEMIUN
const api = express.Router();
const mdAutenticacion = require('./../../middlewares/authentication');
const controllerPremiun = require('./../../controllers/Plan_premium/premium.controller');

// pasas de plan FREEMIUN a PREMIUM
api.put('/getPremium/idCommunity', 
	[mdAutenticacion.Auth],
	controllerPremiun.verificacion
);

module.exports = api;