const community = require('../models/community.model');
const user = require('../models/user.model');

function registerCommunity(req, res) {
	const communityModels = new community();
	const parameters = req.body;

	community.find({ idOwner: req.user.sub }, (err, communityOwner) => {
		// if (communityOwner.length > 0) {
		// 	return res.status(500).send({ message: 'es solo una comunidad por usuario' });
		// }

		community.find({ nameCommunity: parameters.nameCommunity }, (err, communityName) => {
			if (communityName.length > 0) {
				return res.status(500).send({ message: 'este nombre de la comunidad ya esta en uso' });
			}
		});

		communityModels.nameCommunity = parameters.nameCommunity;
		communityModels.desc = parameters.desc;
		communityModels.followers = [];
		communityModels.followings = [];
		communityModels.category = ['sin categoria'];
		communityModels.idOwner = req.user.sub;
		communityModels.nameOwner = req.user.nickName;
		communityModels.administrators = [];
		communityModels.config.bannerUrl = parameters.bannerUrl;
		communityModels.config.imagePer = parameters.imagePer;

		communityModels.save((err, community) => {
			if (err) {
				return res.status(500).send({ message: 'err en la peticion' });
			}
			if (!community) {
				return res.status(500).send({ message: 'err al guardar en la comunidad' });
			}

			return res.status(200).send({ message: community });
		});
	});
}

function editarCommunida(req, res) {
	const { idCommuunity } = req.params;
	const parameters = req.body;

	delete parameters.followers;
	delete parameters.category;
	delete parameters.administrators;
	delete parameters.idUsuario;

	community.findOne({ _id: idCommuunity }, (err, communityById) => {
		if (err) {
			return res.status(500).send({ err: 'error en la petecion' });
		}
		if (!communityById) {
			return res.status(500).send({ err: 'error en la petecion' });
		}
		// verificamos que si el usuario le pertenece el perfil
		if (req.user.sub !== communityById.idUsuario) {
			return res.status(500).send({ mensaje: 'No tiene los permisos para editar este Tu comunidad.' });
		}

		community.findByIdAndUpdate(
			{ _id: idCommuunity },
			parameters,
			{ new: true },
			(err, communityUpdate) => {
				if (err) {
					return res.status(500).send({ err: 'error en la peticion' });
				}
				if (!communityUpdate) {
					return res.status(500).send({ err: 'erro al actualizar la comunidad' });
				}

				return res.status(200).send({ mensaje: communityUpdate });
			},
		);
		// return res.status(200).send({ mensaje: communityById });
	});
}

function editarCategoryCommunidad(req, res) {
	const { idCommuunity } = req.params;
	const parameters = req.body;
	community.findByIdAndUpdate(
		{ _id: idCommuunity },
		{ $push: { category: parameters.category } },
		{ new: true },
		(err, communityCategory) => {
			if (err) {
				return res.status(500).send({ err: 'error en la peticion' });
			}
			if (!communityCategory) {
				return res.status(500).send({ err: 'error al actualizar la category' });
			}
			return res.status(200).send({ mensaje: communityCategory });
		}
	);
}

function deleteCategory(req, res) {
	const { idCommuunity } = req.params;
	const parameters = req.body;
	community.findByIdAndUpdate(
		{ _id: idCommuunity },
		{ $pull: { category: parameters.category } },
		{ new: true },
		(err, communityCategory) => {
			if (err) {
				return res.status(500).send({ err: 'error en la peticion' });
			}
			if (!communityCategory) {
				return res.status(500).send({ err: 'error al actualizar la category' });
			}
			return res.status(200).send({ mensaje: communityCategory });
		}
	);
}

function deleteCommunity(req, res) {
	const { idCommuunity } = req.params;

	community.findOne({ _id: idCommuunity }, (err, communityById) => {
		if (err) {
			return res.status(500).send({ err: 'error en la petecion' });
		}
		if (!communityById) {
			return res.status(500).send({ err: 'error en la petecion' });
		}
		// verificamos que si el usuario le pertenece el perfil
		if (req.user.sub !== communityById.idUsuario) {
			return res.status(500).send({ mensaje: 'Solo el Dueño puede eliminar la comunidad' });
		}

		community.findByIdAndDelete({ _id: idCommuunity }, (err, communityDelete) => {
			if (err) {
				return res.status(500).send({ err: 'error en la peticion' });
			}
			if (!communityDelete) {
				return res.status(500).send({ err: 'error al eliminar la comunidad' });
			}

			return res.status(200).send({ mensaje: communityDelete });
		});
	});
}

function viewCommunityId(req, res) {
	const { idCommunity } = req.params;

	community.findOne({ _id: idCommunity }, (err, communityFindId) => {
		if (err) {
			return res.status(500).send({ err: 'erro en la petecion' });
		}
		if (!communityFindId) {
			return res.status(500).send({ err: 'error al encontrar ala comunidad' });
		}
		return res.status(200).send({ message: communityFindId });
	});
}

function followersCommunity(req, res) {
	const { idCommuunity } = req.params;
	community.findOne(
		{ _id: idCommuunity },
		(err, communityOne) => {
			const userInclud = communityOne.followers.includes(req.user.sub);
			if (userInclud) {
				community.findByIdAndUpdate(
					{ _id: idCommuunity },
					{ $pull: { followers: req.user.sub } },
					{ new: true },
					(err, communityFollowers) => {
						if (err) {
							return res.status(500).send({ err: 'error en la peticion' });
						}
						if (!communityFollowers) {
							return res.status(500).send({ err: 'error en communityFollowers' });
						}
						return res.status(200).send({ mensaje: communityFollowers });
					},
				);
			} else {
				community.findByIdAndUpdate(
					{ _id: idCommuunity },
					{ $push: { followers: req.user.sub } },
					{ new: true },
					(err, communityUnFollowers) => {
						if (err) {
							return res.status(500).send({ err: 'error en la peticion' });
						}
						if (!communityUnFollowers) {
							return res.status(500).send({ err: 'error en communityFollowers' });
						}
						return res.status(200).send({ mensaje: communityUnFollowers });
					},
				);
			}
		},
	);
}

function addAdmin(req, res) {
	const { idCommuunity } = req.params;
	const parameters = req.body;

	community.findOne(
		{ _id: idCommuunity },
		(err, communityOne) => {
			const userInclud = communityOne.administrators.includes(parameters.idUser);
			if (userInclud) {
				return res.status(500).send({ err: 'el usuario ya esta como admin' });
			}
			community.findByIdAndUpdate(
				{ _id: idCommuunity },
				{ $push: { administrators: parameters.idUser } },
				{ new: true },
				(err, communityUpdateAdmin) => {
					if (err) {
						return res.status(500).send({ err: 'error en la peticion de comunidad administrador' });
					}
					if (!communityUpdateAdmin) {
						return res.status(500).send({ err: 'no se pudo en la peticion comunidad administrador' });
					}
					return res.status(200).send({ mensaje: communityUpdateAdmin });
				},
			);
		},
	);
}

function deleteAdmin(req, res) {
	const { idCommuunity } = req.params;
	const parameters = req.body;
	community.findOne({ _id: idCommuunity }, (err, communityOne) => {
		const userInclud = communityOne.administrators.includes(parameters.idUser);
		if (userInclud) {
			community.findByIdAndUpdate(
				{ _id: idCommuunity },
				{ $pull: { administrators: parameters.idUser } },
				{ new: true },
				(err, communityUpdateAdmin1) => {
					if (err) {
						return res.status(500).send({ err: 'error en la peticion de comunidad administrador' });
					}
					if (!communityUpdateAdmin1) {
						return res.status(500).send({ err: 'no se pudo en la peticion comunidad administrador' });
					}
					return res.status(200).send({ mensaje: communityUpdateAdmin1 });
				}
			);
		} else {
			return res.status(200).send({ mesaje: 'Este usuario no tiene rol de admin' });
		}
	});
}

function followersView(req, res) {
	const { idCommuunity } = req.params;

	community.findOne(
		{ _id: idCommuunity },
		(err, communityUser) => {
			user.find({ _id: { $in: communityUser.followers } }, (err, userFollowers) => {
				console.log(communityUser.followers);
				res.status(200).send({ mensjae: userFollowers });
			});
		},
	);
}

function youCommunity(req, res) {
	community.find({ idOwner: req.user.sub }, (err, youCommunityFind) => {
		if (err) {
			return res.status(500).send({ error: err });
		}

		return res.status(200).send({ message: youCommunityFind });
	});
}

module.exports = {
	registerCommunity,
	editarCommunida,
	editarCategoryCommunidad,
	deleteCommunity,
	viewCommunityId,
	followersCommunity,
	addAdmin,
	followersView,
	deleteAdmin,
	deleteCategory,
	youCommunity
};
