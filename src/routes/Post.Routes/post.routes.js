const express = require('express');
const controllerPost = require('../../controllers/post/post.controller');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();

// get
api.get('/feedPosts/', controllerPost.getFeedPosts);
api.get('/PostFrends', [controllerAuth.Auth],controllerPost.getPostFollowing);
api.get('/MyPost/:idPost',[controllerAuth.Auth], controllerPost.getPost);
api.get('/PublicPost/:idPost', controllerPost.getPublicPost);
api.get('/commentsPost/:idPost', [controllerAuth.Auth], controllerPost.getCommentsPost);

// post
api.post('/postPost/:idUser', [controllerAuth.Auth], controllerPost.createPost);
api.post('/compartirPost/:idPost', [controllerAuth.Auth], controllerPost.sharePost);
api.post('/comments/:idPost', [controllerAuth.Auth], controllerPost.commentsPost );

//put
api.put('/UpdatePost/:idPost',[controllerAuth.Auth], controllerPost.updatePost);

module.exports = api;