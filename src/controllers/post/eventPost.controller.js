const PostEvent = require('../../models/post/eventPost.model');
const { UploadImg } = require('../../utils/cloudinary');
const fs = require('fs-extra');

async function createPostEvent(req, res) {
	try {
		const newPost = new PostEvent();
		const { idCommunity } = req.params;

		const {
			title,
			desc,
			location,
			collections,
			startdate,
			endingdate
		} = req.body;

		if (!title || !idCommunity) {
			return res.status(400).send({ message: 'Required data is missing.' });
		}

		console.log(startdate, 'startDate');
		console.log(endingdate, 'endingDate');


		newPost.title = title;
		newPost.desc = desc;
		newPost.images = [];
		newPost.video = [];
		newPost.reactions = [];
		newPost.comments = [];
		newPost.location =  JSON.parse(location);
		newPost.collections = collections;
		newPost.idCommunity = idCommunity;
		newPost.startDate = JSON.parse(startdate) ;
		newPost.endingDate =JSON.parse(endingdate) ;
		if (req.files?.image) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario
			newPost.imagenCover.public_id = result.public_id;
			newPost.imagenCover.secure_url = result.secure_url;

			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image.tempFilePath)) {
				await fs.unlink(req.files.image.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		const PostSave = await newPost.save();
		// Verificar si la operación de guardado fue exitosa
		if (!PostSave) {
			return res.status(500).send({ message: 'Error saving the POST.' });
		}
		return res.status(200).send({ message: PostSave });
	} catch (error) {
		console.error('Error al crear el post:', error);
		// Enviar una respuesta de error con el mensaje de error
		res.status(500).send({ message: 'Error al crear el post' });
	}
}

async function findEventRecent(req, res) {
	try {
		const { idCommunity } = req.params;
	
		// Buscar las 10 postEvent más recientes por idCommunity
		const recentEvents = await PostEvent.find({ idCommunity });
		// if (recentEvents.length === 0) {
		// 	return res.status(404).send({ message: 'No se encontraron eventos para esta comunidad' });
		// }
		
		return res.status(200).send({ message: recentEvents });
	} catch (error) {
		console.error('Error al obtener las postEvent recientes:', error);
		res.status(500).json({ error: 'Error interno del servidor' });
	}
}

module.exports = { createPostEvent, findEventRecent };
