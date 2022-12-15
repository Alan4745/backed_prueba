/* eslint-disable camelcase */
const express = require('express');
const controllerUser = require('../controllers/user.controller');

const md_autenticacion = require('../middlewares/authentication');

// poder usar la rutas.
const api = express.Router();

// metodos Get
api.get('/viewUsers', controllerUser.viewUser);
api.get('/Communitys', [md_autenticacion.Auth], controllerUser.viewCommunitys);
api.get('/postViewCommunity/:idCommunity', [md_autenticacion.Auth], controllerUser.postViewCommunity);

// metodos Post
api.post('/signUp', controllerUser.userRegistration);
api.post('/login', controllerUser.loginUser);

// metodos Put
api.put('/updateUser/:idUser', [md_autenticacion.Auth], controllerUser.updateUser);
api.put('/followMe/:idUser', [md_autenticacion.Auth], controllerUser.followers);

// metodos Delete
api.delete('/deleteUser/:idUser', [md_autenticacion.Auth], controllerUser.deleteUser);

module.exports = api;
