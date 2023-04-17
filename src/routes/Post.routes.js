/* eslint-disable no-unused-vars */
const express = require('express');
const md_autenticacion = require('../middlewares/authentication');
const md_roles = require('../middlewares/userAdminCommunity');
const controllerPostActivity = require('../controllers/post/PostActivity.controller');



const api = express.Router();

//POST
api.post('/savePostActivity/:idcommunity', [md_autenticacion.Auth] , controllerPostActivity.savePostActivity);


//PUT
api.put('/updatePostActivity/:idcommunity', [md_autenticacion.Auth], controllerPostActivity.updatePostActivity);

module.exports = api;
