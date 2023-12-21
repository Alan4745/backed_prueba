const { Publicaciones } = require('./../../models/post/Post.model');
const { UploadImg, UploadVideo } = require('./../../utils/cloudinary');
const communityModel = require('../../models/community.model');


// esta funcion nos ayuda a crear la publicaciones por comunidad
async function createNormalPost(req, res) {
	try {
		const Publicacion_model = new Publicaciones();
		const parameters = req.body;
  
		// Guardamos en el objeto lo que viene del frontend
		Publicacion_model.titulo = parameters.titulo;
		Publicacion_model.desc = parameters.descripcion;
		Publicacion_model.tipoPublicacion = 'opiniones1';
  
		console.log(req.body.titulo);
  
		// Encontrar un objeto en la tabla de la base de datos por medio de la comunidad y enlazarlo al post
		const comunityfind = await communityModel.findById(parameters.idcom).exec();
      
		console.log(comunityfind);
  
		// Lado izquierdo es de los campos de publicación y lado derecho comunidad
		Publicacion_model.communityId = comunityfind._id;
		Publicacion_model.communityName = comunityfind.nameCommunity;
  
		if (req.files?.image) {
			const result = await UploadImg(req.files.image.tempFilePath);
			Publicacion_model.imagen.public_id = result.public_id;
			Publicacion_model.imagen.secure_url = result.secure_url;
		}
  
		if (req.files?.video) {
			const result = await UploadVideo(req.files.video.tempFilePath);
			Publicacion_model.video.public_id = result.public_id;
			Publicacion_model.video.secure_url = result.secure_url;
		}
  
		// Guardar en la base de datos
		const post_save = await Publicacion_model.save();
  
		if (!post_save) {
			return res.status(500).send({ message: 'Error al guardar la publicación' });
		}
  
		return res.status(200).send({ message: post_save });
	} catch (error) {
		console.error('Error al crear la publicación:', error);
		return res.status(500).send({ error: 'Hubo un error al crear la publicación' });
	}
}

// esta funcion nos ayudara a poder editar los post ya publicados
async function editNormalPost(req, res) {
	try {
		console.log(req.params.id_post);
      
		const update_post = await Publicaciones.findByIdAndUpdate(
			{ _id: req.params.id_post },
			{ titulo: req.body.titulo, desc: req.body.desc },
			{ new: true }
		).exec();
      
		return res.status(200).send({ message: update_post });
	} catch (error) {
		console.error('Error al editar el post:', error);
		return res.status(500).send({ error: 'Hubo un error al editar el post' });
	}
}
  
// esta funcion nos permite eliminar el post 
async function deleteNormalPost(req, res) {
	try {
		const delete_post = await Publicaciones.findByIdAndDelete({ _id: req.params.idpost }).exec();
		return res.status(200).send({ message: delete_post });
	} catch (error) {
		console.error('Error al eliminar el post:', error);
		return res.status(500).send({ error: 'Hubo un error al eliminar el post' });
	}
}
  
// esta funcion nos permite buscar dentro de todo los publicaciones
// que pertenezaca a cierta comunidad por medio de su "ID"
//search post by community
async function searchPostByCommunity(req, res) {
	try {
		const find_post = await Publicaciones.find({ communityId: req.params.id }).exec();
		return res.status(200).send({ message: find_post });
	} catch (error) {
		console.error('Error al buscar posts:', error);
		return res.status(500).send({ error: 'Hubo un error al buscar posts' });
	}
}
  
// esta funcion nos ayuda a buscar por medio del atributo "ID"
// de la publicacion
async function searchNormalPostById(req, res) {
	try {
		const find_post = await Publicaciones.findOne({ _id: req.params.id }).exec();
		return res.status(200).send({ message: find_post });
	} catch (error) {
		console.error('Error al buscar el post por ID:', error);
		return res.status(500).send({ error: 'Hubo un error al buscar el post por ID' });
	}
}
  
// esta funcion nos ayuda a darle like a las publicaciones normal
async function likeTheNormalPost(req, res) {
	try {
		const { idPost } = req.params;
  
		const userlike = await Publicaciones.findById(idPost).exec();
  
		if (!userlike) {
			return res.status(500).send({ err: 'Error en la petición' });
		}
  
		const likeUser = userlike.likes.filter((like) => like === req.user.sub);
  
		console.log(likeUser);
  
		if (likeUser.length > 0) {
			const disLike = await Publicaciones.findByIdAndUpdate(
				idPost,
				{ $pull: { likes: req.user.sub } },
				{ new: true }
			).exec();
  
			if (!disLike) {
				return res.status(500).send({ err: 'Error en el dislike' });
			}
  
			return res.status(200).send({ message: disLike });
		} else {
			const postLike = await Publicaciones.findByIdAndUpdate(
				idPost,
				{ $push: { likes: req.user.sub } },
				{ new: true }
			).exec();
  
			if (!postLike) {
				return res.status(500).send({ err: 'Error al actualizar el like del post' });
			}
  
			return res.status(200).send({ message: postLike });
		}
	} catch (error) {
		console.error('Error al manejar likes/dislikes:', error);
		return res.status(500).send({ error: 'Hubo un error al manejar likes/dislikes' });
	}
}
  



module.exports = {
	createNormalPost,
	editNormalPost,
	deleteNormalPost,
	searchPostByCommunity,
	searchNormalPostById,
	likeTheNormalPost
};