/* eslint-disable camelcase */
const express = require('express');

const controllerPosttypeA = require('../../controllers/post/postTypeA.controlle');
const md_autenticacion = require('../../middlewares/authentication');

const api = express.Router();

// Tipo Get
api.get('/responsePost/:idEncuesta', [md_autenticacion.Auth], controllerPosttypeA.responderEncuesta);
// Tipo Post
api.post('/agregarPostTypeA/:idCommunity', [md_autenticacion.Auth], controllerPosttypeA.createPostTypeA);

module.exports = api;
