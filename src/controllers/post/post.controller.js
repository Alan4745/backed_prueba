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

		console.log('author', content);
		console.log('body', req.body);

		// if (type === 'Event') {
		// 	content['name'] = req.body.name;
		// 	content['desc'] = req.body.desc;
		// 	content['fechaI'] = req.body.fechaI;
		// 	content['fechaF'] = req.body.fechaF;
		// 	content['req'] = req.body.req;
		// 	if (req.body.coordinates) {
		// 		content['coordinates'] = req.body.coordinates;
		// 	}
		// 	content['fechaF'] = req.body.fechaF;
		// 	content['fechaF'] = req.body.fechaF;


		// } else if (type === 'Poll') {
		// 	content[''] = req.body;
		// } else if (type === 'Normal') {
		// 	content[''] = req.body;
		// }

		// const PostSave = await newPost.save();
		// // Verificar si la operación de guardado fue exitosa
		// if (!PostSave) {
		// 	return res.status(500).send({ message: 'Error saving the POST.' });
		// }
		return res.status(200).send({});

	} catch (error) {
		console.error('Error al crear el post:', error);
		// Enviar una respuesta de error con el mensaje de error
		res.status(500).send({ message: 'Error al crear el post' });
	}
}

module.exports = { createPost };