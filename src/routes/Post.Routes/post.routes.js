const express = require('express');
const controllerPost = require('../../controllers/post/post.controller');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();

api.post('/postPost/:idUser', [controllerAuth.Auth], controllerPost.createPost);

module.exports = api;