const express = require('express');
const controllerUser = require('../controllers/user.controller');
const controllerAuth = require('../controllers/Auth.controller');

const md_autenticacion = require('../middlewares/authentication');

// poder usar la rutas.
const api = express.Router();

// metodos Get
api.get('/viewUsers', controllerUser.viewUser);// ruta actualizada 🆗

// metodos Post
api.post('/signUp', controllerAuth.userRegistration); // ruta actualizada 🆗
api.post('/login', controllerAuth.loginUser); // ruta actualizada 🆗

// metodos Put
api.put('/updateUser/:idUser', [md_autenticacion.Auth], controllerUser.updateUser); // ruta actualizada 🆗

// metodos Delete
api.delete('/deleteUser/:idUser', [md_autenticacion.Auth], controllerUser.deleteUser); // ruta actualizada 🆗

module.exports = api;
