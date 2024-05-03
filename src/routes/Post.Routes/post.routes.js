const express = require('express');
const controllerPost = require('../../controllers/post/post.controller');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();

// post
api.post('/postPost/:idUser', [controllerAuth.Auth], controllerPost.createPost);

// get
api.get('/feedPosts/', controllerPost.getFeedPosts);
api.get('/events/', controllerPost.getEvents);

module.exports = api;