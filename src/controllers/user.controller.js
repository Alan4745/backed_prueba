/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Post = require('../models/Post.model');
const conversacion = require('./conversations.controller');
// const bcrypt = require('bcrypt');
const jwt = require('../services/jwt');

const saltRounds = 10;
// const bcrypt = require('bcrypt-nodejs');

function userRegistration(req, res) {
  const userModel = new User();
  const parameters = req.body;

  if (!parameters.username || !parameters.email || !parameters.password) {
    return res
      .status(400)
      .send({ error: { mensaje: 'Required data' } });
  }

  User.find({ email: parameters.email }, (err, userFind) => {
    if (userFind.length > 0) {
      return res
        .status(500)
        .send({ error: { message: 'This email is already used' } });
    }

    userModel.username = parameters.username;
    userModel.email = parameters.email;
    userModel.desc = parameters.desc;
    userModel.category = [parameters.category];

    bcrypt.hash(parameters.password, saltRounds, (_err, hash) => {
      userModel.password = hash;

      userModel.save((err, userSave) => {
        if (err) {
          return res
            .status(500)
            .send({ message: 'err en la peticion' });
        }

        if (!userSave) {
          return res
            .status(500)
            .send({ message: 'err al guardar el usuario' });
        }

        return res.status(200).send({ UserInfo: userSave });
      });
    });
  });
}

function loginUser(req, res) {
  const parameters = req.body;

  User.findOne({ email: parameters.email }, (err, userFind) => {
    if (err) return res.status(500).send({ message: 'Error en la peticion' });
    if (!userFind) return res.status(500).send({ message: 'user no find' });
    if (userFind) {
      bcrypt.compare(parameters.password, userFind.password, (err, verifiedPassword) => {
        User.findOne({ email: parameters.email }, { password: 0 }, (err, userFindIdentidad) => {
          if (verifiedPassword) {
            return res
              .status(200)
              .send({ token: jwt.crearToken(userFind), user: userFindIdentidad });
          }

          return res.status(500)
            .send({ mensaje: 'email or password does not match' });
        });
      });
    }
  });
}

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

function followers(req, res) {
  const { idUser } = req.params;

  conversacion.NewConversation(req, res);
  User.findById(idUser, (err, userFind) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion' });
    }
    if (!userFind) {
      return res.status(500).send({ err: 'error en al encotrar usuario' });
    }

    const userFollower = userFind.followers.filter((user) => user === req.user.sub);
    // si el usuario esta en siguiendo
    if (userFollower.length > 0) {
      User.findByIdAndUpdate(
        idUser,
        { $pull: { followers: req.user.sub } },
        { new: true },
        (err, userUnfollower) => {
          if (err) {
            return res.status(500).send({ err: 'error en la peticion' });
          }
          if (!userUnfollower) {
            return res.status(500).send({ err: 'error al actualizar "followers" en usuario' });
          }

          User.findByIdAndUpdate(
            req.user.sub,
            { $pull: { followings: idUser } },
            { new: true },
            (err, userFollowings) => {
              if (err) {
                return res.status(500).send({ err: 'error en la peticion' });
              }
              if (!userFollowings) {
                return res.status(500).send({ err: 'error al actualiar "followings" de usuario ' });
              }
              return res.status(200).send({ mesage: userUnfollower, userFollowings });
            },
          );

          // return res.status(200).send({ mesage: userUnfollower });
        },
      );

      console.log(userFollower.length > 0);
      // no siguie
    } else {
      console.log(userFollower.length > 0);
      User.findByIdAndUpdate(
        idUser,
        { $push: { followers: req.user.sub } },
        { new: true },
        (err, userFollower) => {
          if (err) {
            return res.status(500).send({ err: 'error en la peticion' });
          }
          if (!userFollower) {
            return res.status(500).send({ err: 'error al actualizar "followers" en usuario' });
          }

          User.findByIdAndUpdate(
            req.user.sub,
            { $push: { followings: idUser } },
            { new: true },
            (err, userFollowings) => {
              if (err) {
                return res.status(500).send({ err: 'error en la peticion' });
              }
              if (!userFollowings) {
                return res.status(500).send({ err: 'error al actualiar "followings" de usuario ' });
              }
              return res.status(200).send({ mesage: userFollower, userFollowings });
            },
          );
        },
      );
    }

    // return res.status(200).send({ mensaje: userFind });
  });
}

function viewCommunitys(req, res) {
  User.findOne({ _id: req.user.sub }, { password: 0 }, (err, userComunity) => {
    if (err) {
      return res.status(500).send({ err: 'error en la peticion' });
    }
    if (!userComunity) {
      return res.status(500).send({ err: 'error al buscar al usuario' });
    }

    const Communitys = userComunity.followings;

    User.find({ _id: Communitys }, { password: 0 }, (err, Community) => {
      if (err) {
        return res.status(500).send({ err: 'error en la peticion' });
      }
      if (!Community) {
        return res.status(500).send({ err: 'error al encontrar la comunidad' });
      }

      return res.status(200).send({ mensaje: Community });
    });
  });
}

function postViewCommunity(req, res) {
  const { idCommunity } = req.params;

  console.log(idCommunity);

  Post.find({ userId: idCommunity }, (error, postCommunity) => {
    if (error) {
      return res.status(500).send({ error: 'error en la peticion' });
    }
    console.log(!postCommunity);
    if (!postCommunity) {
      return res.status(500).send({ error: 'error al encotrar el posts de la comunidad' });
    }

    return res.status(200).send({ mensaje: postCommunity });
  });
}

module.exports = {
  userRegistration,
  loginUser,
  updateUser,
  deleteUser,
  viewUser,
  followers,
  viewCommunitys,
  postViewCommunity,
};
