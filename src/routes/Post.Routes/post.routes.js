const express = require("express");
const controllerAuth = require("../../middlewares/authentication");
const postController = require("../../controllers/post");

const api = express.Router();
//rutas gets
api.get("/allPosts", [controllerAuth.Auth], postController.getAllPosts);
api.get("/feedPosts", [controllerAuth.Auth], postController.getFeedPosts);
api.get("/PostFrends", [controllerAuth.Auth], postController.getPostFollowing);
api.get("/MyPost/:idPost", [controllerAuth.Auth], postController.getPost);
api.get("/PostByUser/:idUser", [controllerAuth.Auth], postController.getPostByUser);
api.get("/PublicPost/:idPost", postController.getPublicPost);
api.get('/commentsPost/:idPost', [controllerAuth.Auth], postController.getCommentsPost);
// rutas posts
api.post("/postPost/:idUser", [controllerAuth.Auth], postController.createPost);
api.post("/compartirPost/:idPost/:idUser", [controllerAuth.Auth], postController.sharePost);
api.post("/comments/:idPost/:idUser", [controllerAuth.Auth], postController.addComment);
api.post("/like/:idPost/:idUser", [controllerAuth.Auth], postController.addLike);
api.post("/react/:idPost/:idUser", [controllerAuth.Auth], postController.reactPost);
// rutas put
api.put("/UpdatePost/:idPost", [controllerAuth.Auth], postController.updatePost);
// rutas deletes
api.delete("/DeletePost/:idPost", [controllerAuth.Auth], postController.deletePost);
api.delete("/comment/:idPost/:idComment", [controllerAuth.Auth], postController.deleteComment);
api.delete("/like/:idPost/:idUser", [controllerAuth.Auth], postController.removeLike);

module.exports = api;
