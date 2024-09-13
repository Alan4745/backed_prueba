const { Post } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { Notification, createNotification } = require("../../models/notification");

// AGREGAR LIKE
async function addLike(req, res) {
    console.log("addLike");

    const idPost = req.params.idPost;
    const idUser = req.params.idUser;

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

        // Verificar si el usuario ya dio like al post
        const existingLike = post.likes.find(like => like.userId.toString() === idUser);
        if (existingLike) {
            return res.status(400).send({ message: "El usuario ya dio like a este post." });
        }

        // Crear el nuevo like
        const newLike = {
            userId: idUser,
        };

        // Añadir el nuevo like al post
        post.likes.push(newLike);

        // Guardar los cambios en el post
        await post.save();

        return res.status(200).send({ message: "Like agregado exitosamente", post });
    } catch (error) {
        console.error("Error al agregar like:", error);
        res.status(500).send({ message: "Error al agregar like" });
    }
}

// ELIMINAR LIKE
async function removeLike(req, res) {
    console.log("removeLike");

    const idPost = req.params.idPost;
    const idUser = req.params.idUser;

    try {
        // Buscar el post por ID
        const post = await Post.findById(idPost);
        if (!post) {
            return res.status(404).send({ message: "Post no encontrado." });
        }

        // Buscar el índice del like del usuario
        const likeIndex = post.likes.findIndex(like => like.userId.toString() === idUser);
        if (likeIndex === -1) {
            return res.status(404).send({ message: "Like no encontrado." });
        }

        // Eliminar el like
        post.likes.splice(likeIndex, 1);

        // Guardar los cambios en el post
        await post.save();

        return res.status(200).send({ message: "Like eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar like:", error);
        res.status(500).send({ message: "Error al eliminar like" });
    }
}

module.exports = {
    addLike,
    removeLike,
};
