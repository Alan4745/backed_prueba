const PostNormal = require('../../models/post/normalPost.model');
const { UploadImg } = require('../../utils/cloudinary');
const fs = require('fs-extra');

async function createPostNormal(req, res) {
	try {
		const newPost = new PostNormal();
		const { idCommunity } = req.params;

		const {
			title,
			desc,

		} = req.body;

		if (!title || !idCommunity) {
			return res.status(400).send({ message: 'Required data is missing.' });
		}

		newPost.title = title;
		newPost.desc = desc;
		newPost.images = [];
		newPost.video = [];
		newPost.reactions = [];
		newPost.comments = [];
		newPost.idCommunity = idCommunity;


		

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

module.exports = { createPostNormal };
