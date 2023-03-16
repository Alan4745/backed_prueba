/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const User = require('../models/user.model');

function updateUser(req, res) {
	const { idUser } = req.params.idUser;
	const parameters = req.body;

	// Eliminadadon la entrada de de los siguientes parametros
	delete parameters.password;
	delete parameters.rol;
	delete parameters.email;

	// verificamos que si el usuario le pertenece el perfil
	if (req.user.sub !== idUser) {
		return res.status(500).send({ mensaje: 'No tiene los permisos para editar este Usuario.' });
	}

	User.findByIdAndUpdate(idUser, parameters, { new: true }, (err, userUpdate) => {
		if (err) return res.status(500).send({ message: 'Erro en la pericion' });
		if (!userUpdate) return res.status(500).send({ message: 'error Al Editar el usuario' });

		return res.status(200).send({ UserInfo: userUpdate });
	});
}

function deleteUser(req, res) {
	const { idUser } = req.params.idUser;

	if (req.user.sub !== idUser) {
		return res.status(500).send({ mensaje: 'No tiene los permisos para eliminar este Usuario.' });
	}

	User.findByIdAndDelete(idUser, (err, userDelete) => {
		if (err) return res.status(500).send({ message: 'error en la peticion' });
		if (!userDelete) return res.status(500).send({ message: 'erro en la peticion' });

		return res.status(200).send({ UserInfo: userDelete });
	});
}

function viewUser(req, res) {
	User.find((err, usersView) => res.status(200).send({ UserInfo: usersView }));
}

module.exports = {
	updateUser,
	deleteUser,
	viewUser,
};
