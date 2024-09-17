const { Post } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { Notification, createNotification } = require("../../models/notification");

// AGREGAR COMENTARIO
async function addComment(req, res) {
  console.log("addComment");

  const idPost = req.params.idPost;
  const idUser = req.params.idUser;
  const { text, rating } = req.body; // El comentario ahora viene como 'text' en lugar de 'comment'

  try {
    // Buscar el post por ID
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    // Buscar el usuario por ID
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Crear el nuevo comentario basado en tu esquema
    const newComment = {
      userId: idUser,
      text: text,
      date: new Date().toISOString(), // Agrega la fecha actual
      rating: rating || null, // El rating es opcional
    };

    // Añadir el nuevo comentario al post
    post.comments.push(newComment);

    // Guardar los cambios en el post
    await post.save();

    // Crear una notificación para el autor del post
    // const notification = await createNotification({
    //   recipient: post.author,
    //   sender: idUser,
    //   post: idPost,
    //   type: "new_comment",
    //   message: `${user.nickName} ha comentado tu Post`,
    // });
    console.log(post)

    return res.status(200).send({ message: "Comentario agregado", post });
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

    // Obtener comentarios del post
    const comments = post.comments;

    // Crear una lista de promesas para obtener los avatares de los usuarios
    const commentsWithAvatar = await Promise.all(
      comments.map(async (comment) => {
        try {
          // Buscar el usuario asociado al comentario
          const user = await User.findById(comment.userId);

          // Si se encuentra el usuario, agregar el avatar a la respuesta del comentario
          return {
            ...comment.toObject(),
            name: user ? user.name : null,
            imageAvatar: user ? user.imageAvatar : null,
          };
        } catch (err) {
          // En caso de error al buscar el usuario, retornar el comentario sin avatar
          return {
            ...comment.toObject(),
            imageAvatar: null,
            name: null,
          };
        }
      })
    );

    // Retornar los comentarios con los avatares de usuario
    res.status(200).json(commentsWithAvatar);
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

    if (comment.userId.toString() !== idUser) {
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
