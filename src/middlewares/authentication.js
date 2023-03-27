const jwt_simple = require('jwt-simple');
const moment = require('moment');

const claveSecreta = 'clave_secreta_DIMENSIO';

exports.Auth = function (req, res, next) {
	if (!req.headers.authorization) {
		console.log('The request does not have the Authorization header');
		return res.status(500).send({ mensaje: 'The request does not have the Authorization header' });
	}
	const token = req.headers.authorization.replace(/['"]+/g, '');
	try {
		var payload = jwt_simple.decode(token, claveSecreta);
		// EXP = variable que contiene el tiempo de expiracion del token
		if (payload.exp <= moment().unix()) {
			console.log('El token ha expirado.');
			return res.status(500).send({ mensaje: 'El token ha expirado.' });
		}
	} catch (error) {
		console.log('El token no es valido.');
		return res.status(500).send({ mensaje: 'El token no es valido.' });
	}

	req.user = payload;
	next();
};
