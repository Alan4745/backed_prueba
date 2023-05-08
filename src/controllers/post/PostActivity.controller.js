const PostActivity = require('../../models/post/PostActivity.model');
const Community = require('../../models/community.model');

async function savePostActivity(req, res) {
	const modelPostActivity = new PostActivity();
	const {idcommunity}  = req.params;
	const parameters = req.body;

	if (!parameters.titulo || !parameters.desc || !parameters.tipoPublicacion) {
		return res.status(400).send({message: 'Required data'});
	}

	console.log(idcommunity);

	const community = await Community.findById(idcommunity);

	modelPostActivity.titulo = parameters.titulo;
	modelPostActivity.desc = parameters.desc;
	modelPostActivity.communityId = community._id;
	modelPostActivity.communityName = community.nameCommunity;
	modelPostActivity.tipoPublicacion = parameters.tipoPublicacion; 

	modelPostActivity.save((err, postSave) => {
		if (err) {
			return res.status(500).send({message: err.message});
		}
		if (!postSave) {
			return res.status(500).send({message: 'error en la peticion en guardar el post'});
		}
		return res.status(200).send({message: postSave});
	});
}

async function updatePostActivity(req, res) {
	const { idPost } = req.params;
	const parameters = req.body;

	if (req.files?.image) {
		console.log(req.files.image);
	} else {
		console.log('no traer imagen');
	}

	
	console.log(parameters);
	return res.status(200).send({message: 'update en la peticion en guardar el'});

	// PostActivity.findByIdAndUpdate(idPost, parameters, {new: true}, (err, postActivity) => {
	// 	if (err) {
	// 		return res.status(500).send({message: err});
	// 	}
	// 	if (!postActivity) {
	// 		return res.status(500).send({message: 'error en la peticion al actualizar'});
	// 	}
	// 	return res.status(200).send({message: postActivity});
	// });
}

module.exports = {
	savePostActivity,
	updatePostActivity
};
