/* eslint-disable no-unused-vars */
const express = require('express');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');

const controllerPostTypeA = require('../controllers/post/postTypeA.controlle');
const controllerPostTypeb = require('../controllers/post/postTypeB.controller');
const controllerPostTypeC = require('../controllers/post/postTypeC.controller');
const controllerPost = require('../controllers/post/post.controller');
const Publicacionescontroller=require('../controllers/post_test/Post.controller')

const api = express.Router();

//POST
api.post('/uploadPublication/:idCommunity', [md_autenticacion.Auth, md_roles.AdminComunity], controllerPost.savePost);

api.post('/crear_publicacion/:crearpublicacion', [md_autenticacion.Auth],Publicacionescontroller.crear_publicacion);

api.get('/buscar_post/:id',Publicacionescontroller.buscar_post);

api.delete('/eliminar_post/:id',Publicacionescontroller.eliminar_post);

module.exports = api;
