/* eslint-disable no-unused-vars */
const crypto = require('crypto');
const TokenCollection = require('../models/tokens/tokenCollection.model');
const Collections = require('../models/tokens/collections.model');
const Community = require('../models/community.model');
const Token = require('../models/tokens/tokenUnitary.model');
const fs = require('fs-extra');
const User = require('../models/user.model');

const { UploadImg } = require('../utils/cloudinary');
// function agregarTokenAColecion(req, res) {
//   const parameters = req.body;
//   const { tokenAmount } = parameters;

//   Community.find(
//     { nameCommunity: parameters.nameCommunity, idOwner: req.user.sub },
//     (err, test) => {
//       if (test.length === 0) {
//         return res.status(500).send({ message: 'esta comunidad no te pertenece' });
//       }

//       Collections.find(
//         { author: parameters.nameCommunity, nameCollection: parameters.nameCollection },
//         (err, collectionfind) => {
//           if (collectionfind.length === 0) {
//             return res.status(500).send({ message: 'error nose encontraron similitudes' });
//           }

//           TokenCollection.find(
//             { author: parameters.nameCommunity, idCollection: collectionfind[0]._id },
//             (err, tokenFind) => {
//               for (let i = 0; i < tokenAmount; i += 1) {
//                 const { min } = parameters;
//                 const { max } = parameters;
//                 const randomNumber = Math.floor(Math.random()
//                 * (parseInt(max) - parseInt(min) + 1)) + parseInt(min);
//                 const modeloToken = new TokenCollection();
//                 const randomBytes = crypto.randomBytes(32).toString('hex');
//                 const hash = crypto.createHash('sha256').update(parameters.name + randomBytes).digest('hex');

//                 modeloToken.hash = hash;
//                 modeloToken.title = parameters.title;
//                 modeloToken.desc = parameters.desc;
//                 modeloToken.numertoken = tokenFind.length + i + 1;
//                 // modeloToken.img.imgId = '';
//                 // modeloToken.img.imgUrl = '';
//                 modeloToken.idCollection = collectionfind[0]._id;
//                 modeloToken.author = parameters.nameCommunity;
//                 modeloToken.price = randomNumber;

//                 modeloToken.save((err, saveToken) => {
//                   if (err) {
//                     return res.status(500).send({ message: 'error en la peticion del token' });
//                   }
//                   if (!saveToken) {
//                     return res.status(500).send({ message: 'error la peticion de token esta vacias' });
//                   }
//                 });
//               }

//               return res.status(200).send({ message: `${tokenAmount} tokens created and saved successfully.` });
//             });
//     });
//     });
// }

async function addTokenToCollection(req, res) {
	try {
		const parameters = req.body;
		const { tokenAmount } = parameters;
		const tokens = [];
		let result = {};

		const community = await Community.findOne({
			nameCommunity: parameters.nameCommunity,
			nameOwner: req.user.nickName,
		});

		if (!community) {
			return res
				.status(500)
				.send({ message: 'Esta comunidad no te pertenece' });
		}

		if (tokenAmount > 1000) {
			return res.status(500).send({ message: 'Se supera el límite permitido' });
		}

		const collectionFind = await Collections.findOne({
			author: parameters.nameCommunity,
			nameCollection: parameters.nameCollection,
		});

		console.log(parameters.nameCollection, 'nameCollection');
		console.log(parameters.nameCommunity, 'nameCommunity');

		if (!collectionFind) {
			return res
				.status(500)
				.send({ message: 'Error, no se encontraron similitudes' });
		}

		const tokenFind = await TokenCollection.find({
			author: parameters.nameCommunity,
			idCollection: collectionFind._id,
		});

		
		if (req.files?.image) {
			// Subir la imagen a Cloudinary y obtener el resultado
			result = await UploadImg(req.files.image.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

	

			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image.tempFilePath)) {
				await fs.unlink(req.files.image.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		for (let i = 0; i < tokenAmount; i++) {
			const modelToken = new TokenCollection();
			const randomBytes = crypto.randomBytes(32).toString('hex');
			const hash = crypto
				.createHash('sha256')
				.update(parameters.name + randomBytes)
				.digest('hex');

			modelToken.hash = hash;
			modelToken.title = parameters.title;
			modelToken.desc = parameters.desc;
			modelToken.numertoken = tokenFind.length + i + 1;
			modelToken.idCollection = collectionFind._id;
			modelToken.author = parameters.nameCommunity;
			modelToken.price = parameters.price * 100;

			modelToken.img.imgUrl = result.secure_url;
			modelToken.img.imgId = result.public_id;

			tokens.push(modelToken);
		}

		await TokenCollection.insertMany(tokens);
		return res.status(200).send({
			message: `${tokenAmount} tokens creados y guardados exitosamente.`,
		});
	} catch (error) {
		console.error('Error al agregar tokens a la colección:', error);
		return res
			.status(500)
			.send({ error: 'Hubo un error al agregar tokens a la colección' });
	}
}

async function createCollection (req, res) { 
	try {
		const modelCollections = new Collections();
		const parameters = req.body;
		const randomBytes = crypto.randomBytes(32).toString('hex');
		const hash = crypto
			.createHash('sha256')
			.update(parameters.nameCollection + randomBytes)
			.digest('hex');

		if (!parameters.nameCollection || !parameters.desc || !parameters.author) {
			return res.status(500).send({ message: 'Datos obligatorios faltantes' });
		}

		Community.find({ nameOwner: req.user.nickName },  (err, communityOwner) => {
			if (communityOwner.length === 0) {
				return res.status(500).send({
					message: 'Debes tener una comunidad para poder crear colecciones',
				});
			}

			Collections.find(
				{ nameCollection: parameters.nameCollection },
				async  (err, collectionsName)  => {
					if (collectionsName.length > 0) {
						return res
							.status(500)
							.send({ message: 'Este nombre ya se está utilizando' });
					}

					modelCollections.hash = hash;
					modelCollections.nameCollection = parameters.nameCollection;
					modelCollections.desc = parameters.desc;
					modelCollections.author = parameters.author;


					if (req.files?.image) {
						// Subir la imagen a Cloudinary y obtener el resultado
						const result = await UploadImg(req.files.image.tempFilePath);
						// Guardar la información de la imagen en el modelo de usuario
		
						modelCollections.img.imgUrl = result.secure_url;
						modelCollections.img.imgId = result.public_id;
			
						// Verificar si el archivo temporal existe antes de intentar eliminarlo
						if (fs.existsSync(req.files.image.tempFilePath)) {
							await fs.unlink(req.files.image.tempFilePath);
						} else {
							console.warn('El archivo temporal no existe.');
						}
					}

					modelCollections.save((err, collectionSave) => {
						if (err || !collectionSave) {
							console.error(
								'Error al ejecutar la petición de guardar la colección:',
								err
							);
							return res
								.status(500)
								.send({ message: 'Error al guardar la colección' });
						}

						return res.status(200).send({ message: collectionSave });
					});
				}
			);
		});
	} catch (error) {
		console.error('Error al crear la colección:', error);
		return res
			.status(500)
			.send({ message: 'Hubo un error al crear la colección' });
	}
}

async function viewToken(req, res) {
	try {
		const tokensFid = await TokenCollection.find({
			idCollection: req.params.idCollection,
			adquirido: false // Filtrar por tokens no adquiridos
		}).exec();

		if (tokensFid.length === 0) {
			return res.status(404).send({ message: 'No se encontraron tokens no adquiridos para esta colección' });
		}

		res.status(200).send({ message: tokensFid });
	} catch (error) {
		console.error('Error al buscar tokens:', error);
		res.status(500).send({ error: 'Hubo un error al buscar tokens' });
	}
}



async function findCollectionByName(req, res) {
	const { name } = req.params; // Supongamos que el nombre se pasa como parámetro en la URL
	console.log(name);
	try {
		// Buscar la colección por su nombre
		const collection = await Collections.find({ author: name });
        
		if (collection) {
			// Si se encuentra la colección, devolverla en la respuesta
			return res.status(200).send({message: collection});
		} else {
			// Si no se encuentra la colección, devolver un mensaje de error
			return res.status(404).send({ message: 'No se encontró ninguna colección con ese nombre.' });
		}
	} catch (error) {
		// Manejar errores
		console.error('Error al buscar la colección:', error);
		return res.status(500).send({ message: 'Error interno del servidor.' });
	}
}
function tokensSolos(req, res) {
	Token.find((err, tokenOne) => {
		console.log(tokenOne);
	});
}


async function redeemTicket(req, res) {
	try {
		const idTicket = req.params.idTicket;
		const idUsuario = req.user.sub;

		console.log(idTicket);
		console.log(idUsuario);

		const nuevoBuyerId = req.body.buyerid;

		// Validar si los IDs son válidos
		if (!idTicket || !idUsuario) {
			return res.status(400).send({ message: 'Se requieren IDs de ticket y usuario válidos.' });
		}

		// Verificar si el usuario ya ha adquirido el ticket
		const usuario = await User.findById(idUsuario);
		if (!usuario) {
			return res.status(404).send({ message: 'No se encontró ningún usuario con ese ID.' });
		}
		if (usuario.tokensAbotenidos.includes(idTicket)) {
			return res.status(400).send({ message: 'El usuario ya ha adquirido este ticket.' });
		}

		// Actualizar el ticket
		const ticketActualizado = await TokenCollection.findByIdAndUpdate(
			idTicket,
			{ buyerid: nuevoBuyerId, adquirido: true },
			{ new: true }
		);

		if (!ticketActualizado) {
			return res.status(404).send({ message: 'No se encontró ningún ticket con ese ID.' });
		}

		// Agregar el ticket a los tokens obtenidos del usuario
		usuario.tokensAbotenidos.push(ticketActualizado);

		// Guardar los cambios en el usuario
		await usuario.save();

		res.status(200).send({ message: 'Ticket redimido exitosamente.', ticket: ticketActualizado });
	} catch (error) {
		console.error('Error al redimir el ticket:', error);
		res.status(500).send({ message: 'Error interno del servidor.' });
	}
}


async function burnTicket(req, res) {
	try {
		const idDocumento = req.params.idTicket; // ID del documento a actualizar

		console.log(idDocumento);
		// Validar si el ID es válido
		if (!idDocumento) {
			return res.status(400).send({ message: 'Se requiere un ID de documento válido.' });
		}

		// Buscar el ticket en la base de datos
		const ticket = await TokenCollection.findById(idDocumento);

		// Comprobar si el ticket existe
		if (!ticket) {
			return res.status(404).send({ message: 'No se encontró ningún ticket con ese ID.' });
		}

		// Comprobar si el ticket ya ha sido canjeado
		if (ticket.canjeado) {
			return res.status(400).send({ message: 'El ticket ya ha sido canjeado.' });
		}

		// Actualizar el documento
		const documentoActualizado = await TokenCollection.findByIdAndUpdate(
			idDocumento,
			{ canjeado: true },
			{ new: true }
		);

		// Comprobar si se actualizó el documento
		if (!documentoActualizado) {
			return res.status(404).send({ message: 'No se encontró ningún documento con ese ID.' });
		}

		res.status(200).send({ message: 'Documento actualizado con éxito.', documento: documentoActualizado });
	} catch (error) {
		console.error('Error al actualizar el documento:', error);
		res.status(500).send({ message: 'Error interno del servidor.' });
	}
}

module.exports = {
	addTokenToCollection,
	createCollection,
	viewToken,
	tokensSolos,
	findCollectionByName,
	redeemTicket,
	burnTicket
};

// estas funciones estaran comentadas por son las versiones anteriores

// funcion de agregar token
// async function agregarTokenAColecion(req, res) {
// 	const parameters = req.body;
// 	const { tokenAmount } = parameters;
// 	const tokens = [];

// 	const community = await Community.findOne({
// 		nameCommunity: parameters.nameCommunity,
// 		idOwner: req.user.sub,
// 	});

// 	if (!community) {
// 		return res.status(500).send({ message: 'esta comunidad no te pertenece' });
// 	}
// 	if (tokenAmount > 1000) {
// 		return res.status(500).send({ message: 'Se pasa de el limite' });
// 	}

// 	const collectionFind = await Collections.findOne({
// 		author: parameters.nameCommunity,
// 		nameCollection: parameters.nameCollection,
// 	});

// 	if (!collectionFind) {
// 		return res
// 			.status(500)
// 			.send({ message: 'error no se encontraron similitudes' });
// 	}

// 	const tokenFind = await TokenCollection.find({
// 		author: parameters.nameCommunity,
// 		idCollection: collectionFind._id,
// 	});

// 	for (let i = 0; i < tokenAmount; i++) {
// 		const { min } = parameters;
// 		const { max } = parameters;
// 		const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
// 		const modelToken = new TokenCollection();
// 		const randomBytes = crypto.randomBytes(32).toString('hex');
// 		const hash = crypto
// 			.createHash('sha256')
// 			.update(parameters.name + randomBytes)
// 			.digest('hex');
// 		modelToken.hash = hash;
// 		modelToken.title = parameters.title;
// 		modelToken.desc = parameters.desc;
// 		modelToken.numertoken = tokenFind.length + i + 1;
// 		modelToken.idCollection = collectionFind._id;
// 		modelToken.author = parameters.nameCommunity;
// 		modelToken.price = randomNumber;
// 		tokens.push(modelToken);
// 	}
// 	await TokenCollection.insertMany(tokens);
// 	return res
// 		.status(200)
// 		.send({ message: `${tokenAmount} tokens created and saved successfully.` });
// }

// funcion de crear collecion de tickets/tokens
// function createCollection(req, res) {
// 	const modelCollections = new Collections();
// 	const parameters = req.body;
// 	const randomBytes = crypto.randomBytes(32).toString('hex');
// 	const hash = crypto
// 		.createHash('sha256')
// 		.update(parameters.nameCollection + randomBytes)
// 		.digest('hex');

// 	if (!parameters.nameCollection || !parameters.desc) {
// 		return res.status(500).send({ message: 'datos Oobligatios' });
// 	}

// 	Community.find({ idOwner: req.user.sub }, (err, communityOwner) => {
// 		if (communityOwner.length === 0) {
// 			return res.status(500).send({
// 				message: 'debes de tener una comunidad para poder crea coleciones',
// 			});
// 		}

// 		Collections.find(
// 			{ nameCollection: parameters.nameCollection },
// 			(err, collectionsName) => {
// 				if (collectionsName.length > 0) {
// 					return res
// 						.status(500)
// 						.send({ message: 'este Nombre ya se esta utilizando' });
// 				}

// 				modelCollections.hash = hash;
// 				modelCollections.nameCollection = parameters.nameCollection;
// 				modelCollections.desc = parameters.desc;
// 				modelCollections.author = parameters.author;

// 				modelCollections.save((err, collectionSave) => {
// 					if (err) {
// 						return res
// 							.status(500)
// 							.send({ message: 'error en ejecutar la peticion colecion save' });
// 					}
// 					if (!collectionSave) {
// 						return res
// 							.status(500)
// 							.send({ message: 'error en ejecutar la peticion colecion save' });
// 					}
// 					return res.status(200).send({ message: collectionSave });
// 				});
// 			}
// 		);
// 	});
// }
