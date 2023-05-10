/* eslint-disable no-unused-vars */
const express = require('express');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');
const controllerPostActivity = require('../controllers/post/PostActivity.controller');


// const controllerPostTypeA = require('../controllers/post/postTypeA.controlle');
// const controllerPostTypeb = require('../controllers/post/postTypeB.controller');
// const controllerPostTypeC = require('../controllers/post/postTypeC.controller');
// const controllerPost = require('../controllers/post/post.controller');
const Publicacionescontroller=require('../controllers/post_test/Post.controller')

const api = express.Router();

//POST
api.post('/savePostActivity/:idcommunity', [md_autenticacion.Auth] , controllerPostActivity.savePostActivity);

api.post('/crear_publicacion/:crearpublicacion', [md_autenticacion.Auth],Publicacionescontroller.crear_publicacion);

api.get('/buscar_post/:id',Publicacionescontroller.buscar_post);

api.delete('/eliminar_post/:id_post',Publicacionescontroller.eliminar_post);

api.put('/editar_post/:id_post',Publicacionescontroller.editar_post);

//PUT
api.put('/updatePostActivity/:idcommunity', [md_autenticacion.Auth], controllerPostActivity.updatePostActivity);

module.exports = api;
