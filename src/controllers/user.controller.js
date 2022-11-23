const User = require('../models/user.model');
// const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const bcrypt = require('bcrypt-nodejs');

function userRegistration(req, res) {
    const userModel = new User();
    var parameters = req.body;

    if (!parameters.name || !parameters.email || !parameters.password) {
        return res
            .status(400)
            .send({ error: { mensaje: 'Required data' } });
    }

    User.find({ email: parameters.email }, (err, userFind) => {
        if (userFind.length > 0) {
            return res
                .status(500)
                .send({ error: { message: 'This email is already used' } });
        } else {

            userModel.name = parameters.name;
            userModel.lastName = parameters.lastName;
            userModel.email = parameters.email;
            userModel.password = parameters.password;
            userModel.rol = 'user';


            bcrypt.hash(parameters.password, saltRounds, (err, hash) => {
                userModel.password = hash


                userModel.save((err, userSave) => {
                    if (err) return res
                        .status(500)
                        .send({ message: 'err en la peticion' });

                    if (!userSave) return res
                        .status(500)
                        .send({ message: 'err al guardar el usuario' });

                    return res.status(200).send({ UserInfo: userSave });
                });
            });
        }
    });



}


function loginUser(req, res) {
    var parameters = req.body;

    User.findOne({ email: parameters.email }, (err, userFind) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion' });
        if (!userFind) return res.status(500).send({ message: 'user no find' });
        if (userFind) {

            bcrypt.compare(parameters.password, userFind.password, (err, verifiedPassword) => {
                User.findOne({ email: parameters.email }, { password: 0 }, (err, userFindIdentidad) => {
                    if (verifiedPassword) {
                        return res
                            .status(200)
                            .send({ token: jwt.crearToken(userFind), user: userFindIdentidad })
                    }
                    else {
                        return res.status(500)
                            .send({ mensaje: 'email or password does not match' })
                    }

                });

            });
        }
    });

}

function updateUser(req, res) {
    var idUser = req.params.idUser;
    console.log(idUser);
    var parameters = req.body;

    User.findByIdAndUpdate(idUser, parameters, { new: true }, (err, userUpdate) => {
        if (err) return res.status(500).send({ message: 'Erro en la pericion' });
        if (!userUpdate) return res.status(500).send({ message: 'error Al Editar el usuario' });

        return res.status(200).send({ UserInfo: userUpdate });
    })
}


function deleteUser(req, res) {
    var idUser = req.params.idUser;

    User.findByIdAndDelete(idUser, (err, userDelete) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' });
        if (!userDelete) return res.status(500).send({ message: 'erro en la peticion' });

        return res.status(200).send({ UserInfo: userDelete });
    })
}


function viewUser(req, res) {
    User.find((err, usersView) => {
        return res.status(200).send({ UserInfo: usersView })
    })
}

module.exports = {
    userRegistration,
    loginUser,
    updateUser,
    deleteUser, viewUser

}