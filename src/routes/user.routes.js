const express = require('express');
const controllerUser = require('../controllers/user.controller');
const controllerAuth = require('../controllers/Auth.controller');
const jwt = require('../services/jwt.js');

const md_autenticacion = require('../middlewares/authentication');
const passport = require('passport');
require('./../middlewares/google.js');
// poder usar la rutas.
const api = express.Router();

// metodos Get
api.get('/viewUsers', controllerUser.viewUser); // ruta actualizada 🆗
api.get('/findUsuariosRegex/:name',  [md_autenticacion.Auth] ,controllerUser.findUserRegex); // ruta actualizada 🆗

api.get('/userFindId', [md_autenticacion.Auth], controllerUser.userFindId);
api.get(
	'/userFindById/:idUser',
	[md_autenticacion.Auth],
	controllerUser.userByFindId
);

api.get('/trendingUser', [md_autenticacion.Auth], controllerUser.GetUserTrends);



// metodos Post

api.post('/signUp', controllerAuth.userRegistration); // ruta actualizada 🆗
api.post('/login', controllerAuth.loginUser); // ruta actualizada 🆗

api.get(
	'/google',
	passport.authenticate('auth-google', { scope: ['profile', 'email'] })
);

api.get(
	'/google/callback',
	passport.authenticate('auth-google', { failureRedirect: '/' }),
	async (req, res) => {
		console.log('estamos en call backs');
		const result = await controllerAuth.getUserByEmail(
			req.user.emails[0].value
		);
		console.log(result);

		const token = await jwt.crearToken(result);
		const cadenaTextp = JSON.stringify(result);

		console.log(token);
		res.redirect(
			`memcaps://app/login?firstName=${req.user.name.givenName}/lastName=${req.user.name.familyName}/email=${req.user.emails[0].value}/token=${token}/identidad=${cadenaTextp}`
		);
	}
);

api.get('/hola12', (req, res) => {
	console.log(req.user);
	if (req.isAuthenticated()) {
		res.send(
			`<h1>you are logged in </h1> <span>${JSON.stringify(
				req.user,
				null,
				2
			)} </span>`
		);
	} else {
		res.redirect('/');
	}
});

// metodos Put
api.put(
	'/updateUser/:idUser',
	[md_autenticacion.Auth],
	controllerUser.updateUser
); // ruta actualizada 🆗
api.put('/FollowAUser/:idUser',[md_autenticacion.Auth],controllerUser.FollowAUser); // ruta actualizada 🆗


// .patch('/patchUser/:idUser', [md_autenticacion.Auth], controllerUser.patchUser); // ruta actualizada 🆗

// metodos Delete
api.delete(
	'/deleteUser/:idUser',
	[md_autenticacion.Auth],
	controllerUser.deleteUser
); // ruta actualizada 🆗

module.exports = api;
