const bcrypt = require('bcrypt');
const { UploadImg } = require('../utils/cloudinary');
const User = require('../models/user.model');
const jwt = require('../services/jwt');

const saltRounds = 10;

// funcion para poder registra nuevos usuario en la base de datos
function userRegistration(req, res) {
	// creamos un nuevo objeto de "User"
	const userModel = new User();
	// rastreamos los datos que viene en la petecion
	const parameters = req.body;

	console.log(parameters.name, parameters.nickName, parameters.email, parameters.password);

	// Verificamos que los parametros no venga vacios
	if (!parameters.name || !parameters.nickName || !parameters.email || !parameters.password) {
		return res.status(400).send({ message: 'Required data' });
	}

	// la funcion "find" va a buscar en la base de datos,
	// donde coincidan el parametro "email"
	User.find({ email: parameters.email }, (_err, userFind) => {
		// Verificamos si traer parametro "email" de la peticion
		if (userFind.length > 0) {
			return res.status(500).send({ message: 'This email is already used' });
		}
		// verificamos si traer el parametro "nickName" de la peticion
		User.find({ nickName: `@${parameters.nickName}` }, async (_err, nickNameFind) => {
			if (nickNameFind.length > 0) {
				return res.status(500).send({ message: 'This NickName is already used' });
			}

			// aqui verificamos si nuestra peticion traer un archivo o imagen
			if (req.files?.image) {
				// funcion para subir las imagen a cloudinary
				const result = await UploadImg(req.files.image.tempFilePath);
				console.log(result);
				// Guardamos los datos que nos devuelve cloudinary
				userModel.imageAvatar.public_id = result.public_id;
				userModel.imageAvatar.secure_url = result.secure_url;
			}

			// ---guardamos los parametro en el objeto "userModel"---
			userModel.name = parameters.name;
			userModel.nickName = `@${parameters.nickName}`;
			userModel.email = parameters.email;
			// ---

			// "bcrypt" donde se encarga de incritar la contraseña,
			// antes de que mande a la base de datos
			bcrypt.hash(parameters.password, saltRounds, (_err, hash) => {
				userModel.password = hash;

				// guardamos el objeto "usermodel" para ahora subirlo a la base de datos
				userModel.save((err, userSave) => {
					// aqui capturamos que la base de datos nos devuelva
					if (err) {
						return res
							.status(500)
							.send({ message: 'err en la peticion' });
					}

					// si la repuesta de la base de datos nos regresa "null"
					if (!userSave) {
						return res
							.status(500)
							.send({ message: 'err al guardar el usuario' });
					}

					// si todo salio bien, aqui mostraremos en la respuesta
					return res.status(200).send({ UserInfo: userSave });
				});
			});
		});
	});
}

// funcion de inicio de sesion de parte del servidor
function loginUser(req, res) {
	// rastreamos los datos que viene en la petecion
	const parameters = req.body;
	// expresion regular para poder aceptar los "nickNames" de los usuarios
	const patron = /^@/;

	// Verificamos que los parametros no vengan vacios
	if (!parameters.crede || !parameters.password) {
		return res.status(500).send({ message: 'Falta datos' });
	}

	// Aqui Verificamos que nuestro "espresion regular si se cumple o no"
	if (patron.test(parameters.crede)) {
		// mandamos a buscar la informacion del usuario a la base de datos
		User.findOne({ nickName: parameters.crede }, (err, userFind) => {
			// aqui capturamos que la base de datos nos devuelva
			if (err) return res.status(500).send({ message: 'Error en la peticion' });
			// si la repuesta de la base de datos nos regresa "null"
			if (!userFind) return res.status(500).send({ message: 'user no find' });
			// verificamos si el objeto "userFind" vien con algun objeto
			if (userFind) {
				// verificamos las contraseñas la que viene de la peticion
				// y la que esta en la base de datos
				bcrypt.compare(parameters.password, userFind.password, (_err, verifiedPassword) => {
					// volvemos a solicitar los datos a la base de datos para comprobar
					// que nuestra valicion de las contraseñas sea "true"
					User.findOne(
						{ nickName: parameters.crede },
						{ password: 0 },
						(_err, userFindIdentidad) => {
							// verificamos los que nos devolvido "bcrypt" aya sido "true"
							if (verifiedPassword) {
								return res
									.status(200)
									.send({ token: jwt.crearToken(userFind), user: userFindIdentidad });
							}
							// el caso que "brcrypt" nos aya devolvido "false"
							return res.status(500)
								.send({ mensaje: 'email or password does not match' });
						}
					);
				});
			}
		});
	} else {
		// este el caso que alla ingresado un correo como metodo de inicio de sesion
		User.findOne({ email: parameters.crede }, (err, userFind) => {
			// aqui capturamos que la base de datos nos devuelva
			if (err) return res.status(500).send({ message: 'Error en la peticion' });
			// si la repuesta de la base de datos nos regresa "null"
			if (!userFind) return res.status(500).send({ message: 'user no find' });
			// verificamos si el objeto "userFind" vien con algun objeto
			if (userFind) {
				// verificamos las contraseñas la que viene de la peticion
				// y la que esta en la base de datos
				bcrypt.compare(parameters.password, userFind.password, (_err, verifiedPassword) => {
					// volvemos a solicitar los datos a la base de datos para comprobar
					// que nuestra valicion de las contraseñas sea "true"
					User.findOne({ email: parameters.crede }, { password: 0 }, (_err, userFindIdentidad) => {
						// verificamos los que nos devolvido "bcrypt" aya sido "true"
						if (verifiedPassword) {
							return res
								.status(200)
								.send({ token: jwt.crearToken(userFind), user: userFindIdentidad });
						}
						// el caso que "brcrypt" nos aya devolvido "false"
						return res.status(500)
							.send({ mensaje: 'email or password does not match' });
					});
				});
			}
		});
	}
}

module.exports = {
	userRegistration,
	loginUser
};
