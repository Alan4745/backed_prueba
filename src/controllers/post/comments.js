const Post = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { Notification, createNotification } = require("../../models/notification");

// AGREGAR COMENTARIO
async function addComment(req, res) {
  console.log("addComment");

  const idPost = req.params.idPost;
  const idUser = req.params.idUser;
  const { comment } = req.body;

  try {
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    post.comments.push({
      user: idUser,
      comment: comment,
    });

    await post.save();

    const notification = await createNotification({
      recipient: post.author,
      sender: idUser,
      post: idPost,
      type: "new_comment",
      message: `${user.nickName} ha comentado tu Post`,
    });

    return res.status(200).send({ message: post });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).send({ message: "Error al agregar comentario" });
  }
}

// TRAER COMENTARIOS
async function getCommentsPost(req, res) {
  console.log("getCommentsPost");
  const postId = req.params.idPost;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comments = post.comments;

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// ELIMINAR COMENTARIO
async function deleteComment(req, res) {
  console.log("deleteComment");

  const idPost = req.params.idPost;
  const idComment = req.params.idComment;
  const idUser = req.user.sub;

  try {
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    const comment = post.comments.id(idComment);
    if (!comment) {
      return res.status(404).send({ message: "Comentario no encontrado." });
    }

    if (comment.user.toString() !== idUser) {
      return res.status(403).send({ message: "No autorizado para eliminar este comentario." });
    }

    comment.remove();
    await post.save();

    return res.status(200).send({ message: post });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).send({ message: "Error al eliminar comentario" });
  }
}

module.exports = {
  addComment,
  getCommentsPost,
  deleteComment,
};
