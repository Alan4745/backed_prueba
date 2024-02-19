const bcrypt = require('bcrypt');
const { UploadImg } = require('../utils/cloudinary');
const User = require('../models/user.model');
const jwt = require('../services/jwt');
const fs = require('fs-extra');
const saltRounds = 10;

// funcion para poder registra nuevos usuario en la base de datos
// async function userRegistration(req, res) {
// 	// creamos un nuevo objeto de "User"
// 	const userModel = new User();
// 	// rastreamos los datos que viene en la petecion
// 	const parameters = req.body;

// 	// console.log(parameters.name, parameters.nickName, parameters.email, parameters.password);

// 	// Verificamos que los parametros no venga vacios
// 	if (
// 		!parameters.name ||
//     !parameters.nickName ||
//     !parameters.email ||
//     !parameters.password
// 	) {
// 		return res
// 			.status(400)
// 			.send({ message: `Required data: name:${parameters.name}, nickName: ${parameters.nickName}, email: ${parameters.email}, password: ${parameters.email}` });
// 	}

// 	// la funcion "find" va a buscar en la base de datos,
// 	// donde coincidan el parametro "email"
// 	User.find({ email: parameters.email }, (_err, userFind) => {
// 		// Verificamos si traer parametro "email" de la peticion
// 		if (userFind.length > 0) {
// 			return res.status(500).send({ message: 'This email is already used' });
// 		}
// 		// verificamos si traer el parametro "nickName" de la peticion
// 		User.find(
// 			{ nickName: `@${parameters.nickName}` },
// 			async (_err, nickNameFind) => {
// 				if (nickNameFind.length > 0) {
// 					return res
// 						.status(500)
// 						.send({ message: 'This NickName is already used' });
// 				}

// 				// aqui verificamos si nuestra peticion traer un archivo o imagen
// 				if (req.files?.image) {
// 					try {
// 						// función para subir las imagen a cloudinary
// 						console.log(req.files.image.tempFilePath);
// 						const result = await UploadImg(req.files.image.tempFilePath);
// 						console.log(result);

// 						// Guardamos los datos que nos devuelve cloudinary
// 						userModel.imageAvatar.public_id = result.public_id;
// 						userModel.imageAvatar.secure_url = result.secure_url;

// 						await fs.unlink(req.files.image.tempFilePath);
// 					} catch (error) {
// 						await fs.unlink(req.files.image.tempFilePath);

// 						// captura y manejo de la excepción
// 						console.error('Se produjo un error:', error);
// 						return res.status(500).send({ message: error });
// 					}
// 				}

// 				// ---guardamos los parametro en el objeto "userModel"---
// 				userModel.name = parameters.name;
// 				userModel.nickName = `@${parameters.nickName}`;
// 				userModel.email = parameters.email;
// 				// ---

// 				// "bcrypt" donde se encarga de incritar la contraseña,
// 				// antes de que mande a la base de datos
// 				bcrypt.hash(parameters.password, saltRounds, (_err, hash) => {
// 					userModel.password = hash;

// 					// guardamos el objeto "usermodel" para ahora subirlo a la base de datos
// 					userModel.save((err, userSave) => {
// 						// aqui capturamos que la base de datos nos devuelva
// 						if (err) {
// 							return res.status(500).send({ message: 'err en la peticion' });
// 						}

// 						// si la repuesta de la base de datos nos regresa "null"
// 						if (!userSave) {
// 							return res
// 								.status(500)
// 								.send({ message: 'err al guardar el usuario' });
// 						}

// 						// si todo salio bien, aqui mostraremos en la respuesta
// 						return res.status(200).send({ UserInfo: userSave });
// 					});
// 				});
// 			}
// 		);
// 	});
// }

async function userRegistration(req, res) {
	try {
		// Crear una nueva instancia del modelo de usuario
		const userModel = new User();
		// Obtener los parámetros de la solicitud
		const parameters = req.body;

		// Verificar que los datos requeridos estén presentes
		if (!parameters.name ||
        !parameters.nickName ||
        !parameters.email ||
        !parameters.password
		) {
			return res.status(400).send({ message: 'Required data is missing.' });
		}

		// Buscar si ya existe un usuario con el mismo correo electrónico
		const userByEmail = await User.find({ email: parameters.email });
		if (userByEmail.length > 0) {
			return res.status(400).send({ message: 'This email is already in use.' });
		}

		// Buscar si ya existe un usuario con el mismo apodo (nickName)
		const userByNickName = await User.find({
			nickName: `@${parameters.nickName}`,
		});
		if (userByNickName.length > 0) {
			return res
				.status(400)
				.send({ message: 'This NickName is already in use.' });
		}

		// Si se adjunta una imagen en la solicitud
		if (req.files?.image) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario
			userModel.imageAvatar.public_id = result.public_id;
			userModel.imageAvatar.secure_url = result.secure_url;

			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image.tempFilePath)) {
				await fs.unlink(req.files.image.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		// Asignar los demás datos al modelo de usuario
		userModel.name = parameters.name;
		userModel.nickName = `@${parameters.nickName}`;
		userModel.email = parameters.email;
		// Hashear la contraseña antes de almacenarla en la base de datos
		const hash = await bcrypt.hash(parameters.password, saltRounds);
		userModel.password = hash;
		// Guardar el modelo de usuario en la base de datos
		const userSave = await userModel.save();
		// Verificar si la operación de guardado fue exitosa
		if (!userSave) {
			return res.status(500).send({ message: 'Error saving the user.' });
		}

		// Enviar una respuesta exitosa con la información del usuario guardado
		return res.status(200).send({ UserInfo: userSave });
	} catch (error) {
		// Capturar y manejar cualquier error que ocurra durante el procesoconsole.error('An error occurred:', error);
		return res.status(500).send({ message: 'Internal server error.' });
	}
}

async function registerUserByOauth(user) {
	try {
		console.log(user, 'datos de perfil del usuario');
		let nameWithoutSpace = user.name.givenName.replace(/\s/g, '');

		const userModel = new User();

		userModel.name = user.name.givenName;
		userModel.nickName = `@${nameWithoutSpace}`;
		userModel.email = user.emails[0].value;
		userModel.password = '',
		userModel.imageAvatar.public_id = user.photos[0].value;
		userModel.imageAvatar.secure_url = user.photos[0].value;

		const userSave = await userModel.save();

		console.log(userSave);

		return (userSave);

	} catch (error) {
		console.error('An error occurred:', error);
	}
}

async function getUserByEmail(email) {
	try {
		const UserFind = await  User.findOne({ email: email});

		return UserFind;
	} catch (error) {
		console.error('An error occurred:', error);

	}
}
// funcion de inicio de sesion de parte del servidor
// function loginUser(req, res) {
// 	// rastreamos los datos que viene en la petecion
// 	const parameters = req.body;
// 	// expresion regular para poder aceptar los "nickNames" de los usuarios
// 	const patron = /^@/;

// 	// Verificamos que los parametros no vengan vacios
// 	if (!parameters.crede || !parameters.password) {
// 		return res.status(500).send({ message: 'Falta datos' });
// 	}

// 	// Aqui Verificamos que nuestro "espresion regular si se cumple o no"
// 	if (patron.test(parameters.crede)) {
// 		// mandamos a buscar la informacion del usuario a la base de datos
// 		User.findOne({ nickName: parameters.crede }, (err, userFind) => {
// 			// aqui capturamos que la base de datos nos devuelva
// 			if (err) return res.status(500).send({ message: 'Error en la peticion' });
// 			// si la repuesta de la base de datos nos regresa "null"
// 			if (!userFind) return res.status(500).send({ message: 'user no find' });
// 			// verificamos si el objeto "userFind" vien con algun objeto
// 			if (userFind) {
// 				// verificamos las contraseñas la que viene de la peticion
// 				// y la que esta en la base de datos
// 				bcrypt.compare(
// 					parameters.password,
// 					userFind.password,
// 					(_err, verifiedPassword) => {
// 						// volvemos a solicitar los datos a la base de datos para comprobar
// 						// que nuestra valicion de las contraseñas sea "true"
// 						User.findOne(
// 							{ nickName: parameters.crede },
// 							{ password: 0 },
// 							(_err, userFindIdentidad) => {
// 								// verificamos los que nos devolvido "bcrypt" aya sido "true"
// 								if (verifiedPassword) {
// 									return res.status(200).send({
// 										token: jwt.crearToken(userFind),
// 										user: userFindIdentidad,
// 									});
// 								}
// 								// el caso que "brcrypt" nos aya devolvido "false"
// 								return res
// 									.status(500)
// 									.send({ mensaje: 'email or password does not match' });
// 							}
// 						);
// 					}
// 				);
// 			}
// 		});
// 	} else {
// 		// este el caso que alla ingresado un correo como metodo de inicio de sesion
// 		User.findOne({ email: parameters.crede }, (err, userFind) => {
// 			// aqui capturamos que la base de datos nos devuelva
// 			if (err) return res.status(500).send({ message: 'Error en la peticion' });
// 			// si la repuesta de la base de datos nos regresa "null"
// 			if (!userFind) return res.status(500).send({ message: 'user no find' });
// 			// verificamos si el objeto "userFind" vien con algun objeto
// 			if (userFind) {
// 				// verificamos las contraseñas la que viene de la peticion
// 				// y la que esta en la base de datos
// 				bcrypt.compare(
// 					parameters.password,
// 					userFind.password,
// 					(_err, verifiedPassword) => {
// 						// volvemos a solicitar los datos a la base de datos para comprobar
// 						// que nuestra valicion de las contraseñas sea "true"
// 						User.findOne(
// 							{ email: parameters.crede },
// 							{ password: 0 },
// 							(_err, userFindIdentidad) => {
// 								// verificamos los que nos devolvido "bcrypt" aya sido "true"
// 								if (verifiedPassword) {
// 									return res.status(200).send({
// 										token: jwt.crearToken(userFind),
// 										user: userFindIdentidad,
// 									});
// 								}
// 								// el caso que "brcrypt" nos aya devolvido "false"
// 								return res
// 									.status(500)
// 									.send({ mensaje: 'email or password does not match' });
// 							}
// 						);
// 					}
// 				);
// 			}
// 		});
// 	}
// }

async function loginUser(req, res) {
	try {
		// Obtener los datos de la solicitud
		const parameters = req.body;
		// Expresión regular para aceptar "nickNames" de usuarios
		const patron = /^@/;
  
		// Verificar que los parámetros no estén vacíos
		if (!parameters.crede || !parameters.password) {
			return res.status(400).send({ message: 'Missing data in the request.' });
		}
  
		let userFind;
  
		// Verificar si el parámetro "crede" coincide con el patrón de "nickName"
		if (patron.test(parameters.crede)) {
		// Buscar la información del usuario en la base de datos por "nickName"
			userFind = await User.findOne({ nickName: parameters.crede });
		} else {
		// En caso de que el "crede" no sea un "nickName" (puede ser un correo electrónico)
			userFind = await User.findOne({ email: parameters.crede });
		}
  
		// Si el usuario no se encuentra
		if (!userFind) {
			return res.status(404).send({ message: 'User not found.' });
		}
  
		// Verificar las contraseñas
		const verifiedPassword = await bcrypt.compare(parameters.password, userFind.password);
  
		// Si la validación de las contraseñas fue exitosa
		if (verifiedPassword) {
			const token = jwt.crearToken(userFind);
			return res.status(200).send({ token, user: userFind });
		}
  
		// En caso de que la validación de las contraseñas falle
		return res.status(401).send({ message: 'Email or password does not match.' });
	} catch (error) {
		console.error('An error occurred:', error);
		return res.status(500).send({ message: 'Internal server error.' });
	}
}
  
  

module.exports = {
	userRegistration,
	loginUser,
	registerUserByOauth,
	getUserByEmail
};
