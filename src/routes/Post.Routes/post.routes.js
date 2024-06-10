const express = require('express');
const controllerPost = require('../../controllers/post/post.controller');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();

// post
api.post('/postPost/:idUser', [controllerAuth.Auth], controllerPost.createPost);

// get
api.get('/feedPosts/', controllerPost.getFeedPosts);

api.get('/PostFrends', [controllerAuth.Auth],controllerPost.getPostFollowing);

api.get('/MyPost/:idPost',[controllerAuth.Auth], controllerPost.getPost);

api.put('/UpdatePost/:idPost',[controllerAuth.Auth], controllerPost.updatePost);

api.post('/compartirPost/:idPost', [controllerAuth.Auth], controllerPost.sharePost);

api.post('/comments/:idPost', [controllerAuth.Auth], controllerPost.commentsPost );

api.get('/commentsPost/:idPost', [controllerAuth.Auth], controllerPost.getCommentsPost);

module.exports = api;