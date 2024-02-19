const express = require('express');
const controllerUser = require('../controllers/user.controller');
const controllerAuth = require('../controllers/Auth.controller');

const md_autenticacion = require('../middlewares/authentication');
const passport = require('passport');
require('./../middlewares/google.js');
// poder usar la rutas.
const api = express.Router();

// metodos Get
api.get('/viewUsers', controllerUser.viewUser);// ruta actualizada 🆗

// metodos Post
api.post('/signUp', controllerAuth.userRegistration); // ruta actualizada 🆗
api.post('/login', controllerAuth.loginUser); // ruta actualizada 🆗

api.get('/google', passport.authenticate('auth-google', {scope: ['profile','email'],
}));

api.get('/google/callback', passport.authenticate('auth-google', {failureRedirect:'/'}), (req, res) => {
	console.log('estamos en call backs');
	console.log(req.user);
	res.redirect(
		`memcaps://app/login?firstName=${req.user.name.givenName}/lastName=${req.user.lastName.name.familyName}/email=${req.user.email}`);
});

api.get('/hola12', (req, res) => {
	console.log(req.user);
	if (req.isAuthenticated()) {
		res.send(`<h1>you are logged in </h1> <span>${JSON.stringify(req.user, null,2)} </span>`);
	} else {
		res.redirect('/');
	}
});

// metodos Put
api.put('/updateUser/:idUser', [md_autenticacion.Auth], controllerUser.updateUser); // ruta actualizada 🆗

// metodos Delete
api.delete('/deleteUser/:idUser', [md_autenticacion.Auth], controllerUser.deleteUser); // ruta actualizada 🆗

module.exports = api;
