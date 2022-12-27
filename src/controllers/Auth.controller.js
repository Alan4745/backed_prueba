/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('../services/jwt');

const saltRounds = 10;

function userRegistration(req, res) {
  const userModel = new User();
  const parameters = req.body;

  console.log(parameters.name, parameters.nickName, parameters.email, parameters.password);

  if (!parameters.name || !parameters.nickName || !parameters.email || !parameters.password) {
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

    User.find({ nickName: `@${parameters.nickName}` }, (err, nickNameFind) => {
      if (nickNameFind.length > 0) {
        return res
          .status(500)
          .send({ error: { message: 'This NickName is already used' } });
      }

      userModel.name = parameters.name;
      userModel.nickName = `@${parameters.nickName}`;
      userModel.email = parameters.email;

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
  });
}

function loginUser(req, res) {
  const parameters = req.body;
  const patron = /^@/;

  if (patron.test(parameters.crede)) {
    User.findOne({ nickName: parameters.crede }, (err, userFind) => {
      if (err) return res.status(500).send({ message: 'Error en la peticion' });
      if (!userFind) return res.status(500).send({ message: 'user no find' });
      if (userFind) {
        bcrypt.compare(parameters.password, userFind.password, (err, verifiedPassword) => {
          User.findOne(
            { nickName: parameters.crede },
            { password: 0 },
            (err, userFindIdentidad) => {
              if (verifiedPassword) {
                return res
                  .status(200)
                  .send({ token: jwt.crearToken(userFind), user: userFindIdentidad });
              }
              return res.status(500)
                .send({ mensaje: 'email or password does not match' });
            },
          );
        });
      }
    });
  } else {
    User.findOne({ email: parameters.crede }, (err, userFind) => {
      if (err) return res.status(500).send({ message: 'Error en la peticion' });
      if (!userFind) return res.status(500).send({ message: 'user no find' });
      if (userFind) {
        bcrypt.compare(parameters.password, userFind.password, (err, verifiedPassword) => {
          User.findOne({ email: parameters.crede }, { password: 0 }, (err, userFindIdentidad) => {
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
}

module.exports = {
  userRegistration,
  loginUser,
};
