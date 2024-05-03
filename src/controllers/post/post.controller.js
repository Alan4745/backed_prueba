const Post = require('../../models/post/posts.model');
const { UploadImg } = require('../../utils/cloudinary');
const fs = require('fs-extra');


async function createPost(req, res) {
	console.log('createPost');
	try {
		const newPost = new Post();

		// id del autor pasado como parámetro
		const {idUser} = req.params;
		let image = {};
		let imagens = [];

		const {
			type,
		} = req.body;


		if (req.files?.image) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

			image.public_id = result.public_id;
			image.secure_url = result.secure_url;

			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image.tempFilePath)) {
				await fs.unlink(req.files.image.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}


		if (req.files?.image1) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image1.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

			imagens.push({
				public_id: result.public_id,
				secure_url: result.secure_url
			});
			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image1.tempFilePath)) {
				await fs.unlink(req.files.image1.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		if (req.files?.image2) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image2.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

			imagens.push({
				public_id: result.public_id,
				secure_url: result.secure_url
			});
			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image2.tempFilePath)) {
				await fs.unlink(req.files.image2.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		if (req.files?.image3) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image3.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

			imagens.push({
				public_id: result.public_id,
				secure_url: result.secure_url
			});
			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image3.tempFilePath)) {
				await fs.unlink(req.files.image3.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		if (req.files?.image4) {
			// Subir la imagen a Cloudinary y obtener el resultado
			const result = await UploadImg(req.files.image4.tempFilePath);
			// Guardar la información de la imagen en el modelo de usuario

			imagens.push({
				public_id: result.public_id,
				secure_url: result.secure_url
			});
			// Verificar si el archivo temporal existe antes de intentar eliminarlo
			if (fs.existsSync(req.files.image4.tempFilePath)) {
				await fs.unlink(req.files.image4.tempFilePath);
			} else {
				console.warn('El archivo temporal no existe.');
			}
		}

		const content = {};

		newPost.author = idUser;
		newPost.image = image;
		newPost.type = type;

		console.log('content', content);
		// console.log('body', req.body);
		// console.log('type', type);

		if (type === 'Event') {
			content.name = req.body.name;
			content.desc = req.body.desc;
			content.fechaI = JSON.parse(req.body.fechaI) ;
			content.fechaF = JSON.parse(req.body.fechaF) ;
			content.req = JSON.parse(req.body.req) ;
			if (JSON.parse(req.body.coordinates) ) {
				content.coordinates = JSON.parse(req.body.coordinates); 
			}
			if (JSON.parse(req.body.ubicacion) ) {
				content.ubicacion = JSON.parse(req.body.ubicacion);
			}
			content.pictures = imagens;

		} else if (type === 'Poll') {

			console.log(req.body.options);
			content.question = req.body.question;
			content.desc = req.body.desc;
			content.options = JSON.parse(req.body.options) ;
			content.votes = {
				option1: [''],
				option2: [''],
				option3: [''],
				option4: ['']
			};

		} else if (type === 'Normal') {
			content.title = req.body.title;
			content.desc = req.body.desc;
			content.pictures = imagens;
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

async function getFeedPosts(req, res) {
	console.log('getFeedPosts');
	try {
		const authorsId = req.query.authorsId; // Access query parameters
		const authorsIdSplit = authorsId.split(',');
		console.log('Authors IDs:', authorsIdSplit);
		console.log('Authors IDs:', typeof(authorsIdSplit));
		// const {authorsId} = JSON.parse(req.headers.data);
		// console.log(authorsId);

		const latestPosts = await Post
			.find({author: {$in: authorsIdSplit}})
			.sort({ createdAt: -1 })
			.limit(15)
			.exec();

		// console.log(latestPosts);

		return res.status(200).send({message: latestPosts});
	} catch (err) {
		console.error('Error', err);
		res.status(500).send({ message: 'Error al obtener' });
	}
}

module.exports = { createPost, getFeedPosts };