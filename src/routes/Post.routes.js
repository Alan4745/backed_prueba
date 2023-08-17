/* eslint-disable no-unused-vars */
const express = require('express');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');
const controllerPostActivity = require('../controllers/post/PostActivity.controller');


// const controllerPostTypeA = require('../controllers/post/postTypeA.controlle');
// const controllerPostTypeb = require('../controllers/post/postTypeB.controller');
// const controllerPostTypeC = require('../controllers/post/postTypeC.controller');
// const controllerPost = require('../controllers/post/post.controller');
const Publicacionescontroller=require('../controllers/post_test/Post.controller');
const Post_evento_controller=require('../controllers/post_test/post_evento');
const Post_evento_tickets=require('../controllers/post_test/Post_evento_ticket');

const api = express.Router();

//POST
api.post('/post_evento/:crear_evento',[md_autenticacion.Auth],Post_evento_controller.crear_evento);

api.post('/savePostActivity/:idcommunity', [md_autenticacion.Auth] , controllerPostActivity.savePostActivity);

api.post('/crear_publicacion/:crearpublicacion', [md_autenticacion.Auth],Publicacionescontroller.crear_publicacion);

api.get('/buscar_post_comunidad/:id',Publicacionescontroller.buscar_post);
api.get('/buscar_post_id/:id',Publicacionescontroller.buscar_post_id);

api.get('/buscar_evento/:id',Post_evento_controller.buscar_evento);
api.get('/buscar_evento_id/:evento_id',Post_evento_controller.buscar_evento_id);

api.delete('/eliminar_post/:id_post',Publicacionescontroller.eliminar_post);

api.delete('/eliminar_evento/:id_evento',Post_evento_controller.eliminar_evento);

api.put('/editar_post/:id_post',Publicacionescontroller.editar_post);
api.put('/editarEvento/:evento_id',Post_evento_controller.editar_evento);

//PUT
api.put('/updatePostActivity/:idcommunity', [md_autenticacion.Auth], controllerPostActivity.updatePostActivity);

// evento sin tickets


//post normal

//post opinion


// evento con tickets

api.post('/post_evento_ticket/:crear_evento',[md_autenticacion.Auth],Post_evento_tickets.crear_evento_ticket);
api.delete('/eliminar_evento_ticket/:id_evento',Post_evento_tickets.eliminar_evento_tickets);

api.get('/buscar_evento_ticket_comunidad/:id',Post_evento_tickets.buscar_evento_ticket);
api.get('/buscar_evento_ticket_id/:evento_id',Post_evento_tickets.buscar_evento_ticket_id);

api.put('/editar_evento_tickets/:evento_ticket_id',Post_evento_tickets.editar_evento_ticket);


//RUTAS PARA LIKES Y COMENTARIOS 
api.put('/likes/:idPost',[md_autenticacion.Auth],Publicacionescontroller.likesUpdate);
api.put('/coments/:idPost',[md_autenticacion.Auth],Publicacionescontroller.commentsUser);

//RUTA PARA nombre

api.get('/nombre_post/:nombre/:apellido',[md_autenticacion.Auth],Publicacionescontroller.BuscarPostPorNombre);
module.exports = api;
