/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
const express = require('express');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');

const controllerPostTypeA = require('../controllers/post/postTypeA.controlle');
const controllerPostTypeb = require('../controllers/post/postTypeB.controller');
const controllerPostTypeC = require('../controllers/post/postTypeC.controller');
const controllerPost = require('../controllers/post/post.controller');

const api = express.Router();

//POST
api.post('/uploadPublication/:idCommunity', [md_autenticacion.Auth, md_roles.AdminComunity], controllerPost.savePost)


module.exports = api;
