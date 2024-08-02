const { Post } = require("../../models/post/posts.model");

async function deletePost(req, res) {
  console.log("deletePost");
  const postId = req.params.idPost;
  const idUser = req.user.sub;
  try {
    const post = await Post.findOneAndDelete({ _id: postId, author: idUser });
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado o no te pertenece." });
    }
    res.status(200).json({ message: "Post eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el Post." });
    console.log(error);
  }
}

module.exports = deletePost;
