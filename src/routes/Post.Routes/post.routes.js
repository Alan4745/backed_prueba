const express = require("express");
const controllerPost = require("../../controllers/post/post.controller");
const controllerAuth = require("../../middlewares/authentication");

const api = express.Router();

// get
api.get("/allPost", [controllerAuth.Auth], controllerPost.getAllPosts);
api.get("/feedPosts/", controllerPost.getFeedPosts);
api.get("/PostFrends", [controllerAuth.Auth], controllerPost.getPostFollowing);
api.get("/MyPost/:idPost", [controllerAuth.Auth], controllerPost.getPost);
api.get(
  "/PostByUser/:idUser",
  [controllerAuth.Auth],
  controllerPost.getPostByUser
);
api.get("/PublicPost/:idPost", controllerPost.getPublicPost);
api.get(
  "/commentsPost/:idPost",
  [controllerAuth.Auth],
  controllerPost.getCommentsPost
);

// post
//Ruta para crear un Post
api.post("/postPost/:idUser", [controllerAuth.Auth], controllerPost.createPost);
api.post(
  "/compartirPost/:idPost",
  [controllerAuth.Auth],
  controllerPost.sharePost
);
api.post(
  "/comments/:idPost",
  [controllerAuth.Auth],
  controllerPost.commentsPost
);
api.post("/react/:idPost", [controllerAuth.Auth], controllerPost.reactPost);

//put
api.put(
  "/UpdatePost/:idPost",
  [controllerAuth.Auth],
  controllerPost.updatePost
);

//delete
api.delete(
  "/DeletePost/:idPost",
  [controllerAuth.Auth],
  controllerPost.deletePost
);

module.exports = api;
