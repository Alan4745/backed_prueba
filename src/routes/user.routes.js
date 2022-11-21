const express = require('express');
const controllerUser = require('../controllers/user.controller');


//poder usar la rutas.
const api = express.Router();

api.post('/signUp', controllerUser.userRegistration);
api.post('/login', controllerUser.loginUser);
api.put('/updateUser', controllerUser.updateUser);


module.exports = api;