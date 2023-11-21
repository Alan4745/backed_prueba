const express = require('express');

const api = express.Router();
const controllerChannel = require('../controllers/channel.controller');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');

// metodos post
api.post('/saveChannel/:idCommunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerChannel.saveChannel);


// metodos put

api.put('/suscripcionSubCanal/idSubCommunity', [md_autenticacion.Auth], controllerChannel.suscripcionSubCanal);
// metodos delete
// metodos get
api.get('/getChannel', [md_autenticacion.Auth], controllerChannel.viewChannel);
api.get('/obtenerTodasComunidades/:idcommunity', [md_autenticacion.Auth], controllerChannel.verSubCanales);


module.exports = api;
