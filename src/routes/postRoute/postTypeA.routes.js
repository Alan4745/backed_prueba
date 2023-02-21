/* eslint-disable camelcase */
const express = require('express');

const controllerPosttypeA = require('../../controllers/post/postTypeA.controlle');
const md_autenticacion = require('../../middlewares/authentication');

const api = express.Router();

// Tipo Get
api.put('/responsePost/:idEncuesta', [md_autenticacion.Auth], controllerPosttypeA.responderEncuesta);
// Tipo Post
api.post('/agregarPostTypeA/:idCommunity', [md_autenticacion.Auth], controllerPosttypeA.createPostTypeA);
// Tipo Put

// tipo Delete
api.delete('/deletePostTypeA/:idEncuesta', [md_autenticacion.Auth], controllerPosttypeA.deletoPostA);

module.exports = api;
