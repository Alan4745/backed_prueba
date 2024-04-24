const Post = require('../../models/post/posts.model');
// const { UploadImg } = require('../../utils/cloudinary');
// const fs = require('fs-extra');

async function createPost(req, res) {
	console.log('createPost');
	try {
		const newPost = new Post();

		// id del autor pasado como parámetro
		const {idUser} = req.params;

		const {
			image,
			type,
		} = req.body;

		const content = {};

		newPost.author = idUser;
		newPost.image = image;
		newPost.type = type;

		console.log('content', content);
		console.log('body', req.body);
		console.log('type', type);

		if (type === 'Event') {
			content.name = req.body.content.name;
			content.desc = req.body.content.desc;
			content.fechaI = req.body.content.fechaI;
			content.fechaF = req.body.content.fechaF;
			content.req = req.body.content.req;
			if (req.body.content.coordinates) {
				content.coordinates = req.body.content.coordinates;
			}
			if (req.body.content.ubicacion) {
				content.ubicacion = req.body.content.ubicacion;
			}
			content.pictures = req.body.content.pictures;

		} else if (type === 'Poll') {
			content.question = req.body.content.question;
			content.desc = req.body.content.desc;
			content.options = req.body.content.options;

		} else if (type === 'Normal') {
			content.title = req.body.content.title;
			content.desc = req.body.content.desc;
			content.pictures = req.body.content.pictures;
		}

		console.log('content', content);

		newPost.content = content;

		console.log('newPost', newPost);

		const PostSave = await newPost.save();
		// Verificar si la operación de guardado fue exitosa
		if (!PostSave) {
			return res.status(500).send({ message: 'Error saving the POST.' });
		}
		return res.status(200).send({message: PostSave});

	} catch (error) {
		console.error('Error al crear el post:', error);
		// Enviar una respuesta de error con el mensaje de error
		res.status(500).send({ message: 'Error al crear el post' });
	}
}

module.exports = { createPost };