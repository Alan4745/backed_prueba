/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
const express = require('express');
const controllerPost = require('../../controllers/post/post.controller');
const md_autenticacion = require('../../middlewares/authentication');

const api = express.Router();

api.post('/subirPost', [md_autenticacion.Auth], controllerPost.SavePost);
api.put('/likepost/:idPost', [md_autenticacion.Auth], controllerPost.likesUpdate);
api.put('/userComments/:idPost', [md_autenticacion.Auth], controllerPost.commentsUser);
api.get('/postView', controllerPost.ViewPost);

module.exports = api;
