const User = require('../models/user.model');
// const bcrypt = require('bcrypt-nodejs');

function userRegistration(req, res) {
    const userModel = new User();
    var parameters = req.body;

    console.log(parameters.email)

    userModel.name = parameters.name;
    userModel.email = parameters.email;
    userModel.password = parameters.password;

    userModel.save((err, userSave) => {
        if (err) return res
            .status(500)
            .send({ message: 'err en la peticion' });

        if (!userSave) return res
            .status(500)
            .send({ message: 'err al guardar el usuario' });

        return res.status(200).send({ UserInfo: userSave });
    })

}


function loginUser(req, res) {
    var parameters = req.body;

    User.findOne({ email: parameters.email }, (err, userFind) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (userFind) {
            if (userFind.password === parameters.password) {
                return res
                    .status(200)
                    .send({ email: parameters.email, password: parameters.password })
            }

            return res.status(500)
                .send({ mensaje: 'La contrasena no coincide.' })
        }
    });

}

function updateUser(req, res) {
    var idUser = req.params.id;
    var parameters = req.body;

    User.findByIdAndUpdate(idUser, parameters, { new: true }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: 'Erro en la pericion' });
        if (!userUpdate) return res.status(500).send({ message: 'error Al Editar el usuario' });

        return res.status(200).send({ UserInfo: userUpdate });
    })
}

module.exports = {
    userRegistration,
    loginUser,
    updateUser
}