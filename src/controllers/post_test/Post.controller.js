const {Publicaciones} = require('./../../models/post/Post.model');
const { UploadImg, UploadVideo } = require('../../utils/cloudinary');
const communityModel = require('./../../models/community.model');

//function post_test(req,res) {
//     console.log("ya estamos aqui")
// console.log(req.body)
//     return res.status(200).send({message:"jolasdasd"})
    
// }
// function post_test12(req,res) {
    
//     // const postModel = new Publicaciones();
//     // console.log(postModel);
//     // console.log(req.params.idcomunidad)

// console.log(req.body.TITULO)
//     return res.status(200).send({message:"jolasdasd"})
    
// }

//encontrar post por medio de comunidad
async function eliminar_post(req,res){
	Publicaciones.findByIdAndDelete({_id:req.params.idpost},(err,delete_post)=>{
		return res.status(200).send({message:delete_post});
	});
}

// EDITAR POST 
async function editar_post(req,res){
	console.log(req.params.id_post);
	Publicaciones.findByIdAndUpdate({_id:req.params.id_post},{titulo: req.body.titulo, desc: req.body.desc},{new: true},(err,update_post)=>{
		return res.status(200).send({message:update_post});
	});
}

async function buscar_post(req,res){
	Publicaciones.find({communityId:req.params.id},(err,find_post)=>{
		return res.status(200).send({message:find_post});
	});
}
async function buscar_post_id(req,res){
	Publicaciones.findOne({_id:req.params.id},(err,find_post)=>{
		return res.status(200).send({message:find_post});
	});
}

async function crear_publicacion(req, res) {
    
	const Publicacion_model = new Publicaciones();
	const parameters=req.body;
	//guardarmos en el objeto lo que viene del front end
	Publicacion_model.titulo= parameters.titulo;
	Publicacion_model.desc= parameters.descripcion;
	Publicacion_model.tipoPublicacion= 'opiniones1';
    
	console.log(req.body.titulo);
    
	//encontrar un objeto en la tabla de la base de datos por medio de la comunidad y enlazarlo al post
	communityModel.findById( parameters.idcom,(_err, comunityfind)=>{
		console.log(comunityfind);
		//LADO IZQUIERDO ES DE LOS CAMPOS DE PUBLICACION Y LADO DERECHO COMUNIDAD
		Publicacion_model.communityId=comunityfind._id;
		Publicacion_model.communityName=comunityfind.nameCommunity;
	});




	if (req.files?.image) {
		const result = await UploadImg(req.files.image.tempFilePath);
		Publicacion_model.imagen.public_id = result.public_id;
		Publicacion_model.imagen.secure_url = result.secure_url;
	}


	if (req.files?.video) {
		const result = await UploadVideo(req.files.image.tempFilePath);
		Publicacion_model.video.public_id = result.public_id;
		Publicacion_model.video.secure_url = result.secure_url;
	}

    
	//GUARDAR EN LA BASE DE DATOS 
	Publicacion_model.save((err, post_save)=>{
		if (err) {
			return res.status(500).send({ message: 'err en la peticion' });
		}

		// si la repuesta de la base de datos nos regresa "null"
		if (!post_save) {
			return res
				.status(500)
				.send({ message: 'err al guardar el usuario' });
		}

		return res.status(200).send({message:post_save});
	});
    

}
function likesUpdate(req, res) {
	const { idPost } = req.params;
  
	Publicaciones.findById(idPost, (err, userlike) => {
	  if (err) {
		return res.status(500).send({ err: 'error en la peticion' });
	  }
  
	  if (!userlike) {
		return res.status(500).send({ err });
	  }
  
	  const likeUser = userlike.likes.filter((like) => like === req.user.sub);
  
	  console.log(likeUser);
	  if (likeUser.length > 0) {
		Publicaciones.findByIdAndUpdate(idPost,{ $pull: { likes: req.user.sub } },{ new: true },(err, disLike) => {
			if (err) {
			  return res.status(500).send({ err: 'error en la peticion' });
			}
			if (!disLike) {
			  return res.status(500).send({ err: 'Error en la deslike' });
			}
			return res.status(200).send({ mesage: disLike });
		  },
		);
	  } else {
		Publicaciones.findByIdAndUpdate(
		  idPost,
		  { $push: { likes: req.user.sub } },
		  { new: true },
		  (err, postLike) => {
			if (err) {
			  return res.status(500).send({ err: 'error en la peticion' });
			}
  
			if (!postLike) {
			  return res.status(500).send({ err: 'error al actualizar el like de post' });
			}
  
			return res.status(200).send({ mesage: postLike });
		  },
		);
	  }
	});
  }
  
  function commentsUser(req, res) {
	const { idPost } = req.params;
	const parameters = req.body;
	Publicaciones.findByIdAndUpdate(idPost, {$push: {comments:  { idUser: req.user.sub, comments: parameters.comments },
	 },
	}, { new: true }, (err, commentUser) => {
	  if (err) {
		return res.status(500).send({ err: 'error en la peticion' });
	  }
	  if (!commentUser) {
		return res.status(500).send({ err: 'error al enviar el comentario' });
	  }
  
	  return res.status(200).send({ mesage: commentUser });
	});
  }

  //BUSCAR POST POR NOMBRE
  function BuscarPostPorNombre(req, res) {
    var nombreProduco = req.params.nombre;

	console.log(req.params);
    Publicaciones.find({  titulo: { $regex: nombreProduco, $options: "i" }  }, (err, Post_encontrados) => {
        if (err) return res.status(500).send({ mensaje: 'Error en  la peticion' });
        if (!Post_encontrados){ 
			return res.status(500)
            .send({ mensaje: 'Error al obtener los Productos' })
		}
        return res.status(200).send({ post: Post_encontrados })
    })
}



module.exports = {
	
	crear_publicacion,
	buscar_post,
	eliminar_post,
	editar_post,
	buscar_post_id,
	likesUpdate,
	BuscarPostPorNombre,
	commentsUser
};
