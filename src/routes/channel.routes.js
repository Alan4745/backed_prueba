const express = require('express');

const api = express.Router();
const controllerChannel = require('../controllers/channel.controller');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');

// metodos post
api.post('/saveChannel/:idCommunity', [md_autenticacion.Auth, md_roles.ownerCommunity], controllerChannel.saveChannel);
// metodos put
// metodos delete
// metodos get
api.get('/getChannel', [md_autenticacion.Auth], controllerChannel.viewChannel);

module.exports = api;
