const { Post, SharedPost } = require("../../models/post/posts.model");
const { Notification, createNotification } = require("../../models/notification");
const User = require("../../models/user.model");

// COMPARTIR POST
async function sharePost(req, res) {
  console.log("sharePost");

  const { idPost } = req.params;
  const { idUser } = req.params;
  const { desc } = req.body;

  try {
    const existingPost = await Post.findById(idPost);
    if (!existingPost) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    const newSharedPost = new SharedPost({
      originalPost: idPost,
      author: idUser,
      desc: desc,
    });

    const SharedPostSave = await newSharedPost.save();
    if (!SharedPostSave) {
      return res.status(500).send({ message: "Error al compartir el POST." });
    }

    const author = await User.findById(idUser);
    if (!author) {
      return res.status(404).send({ message: "User not found." });
    }

    const notifications = author.followers.map((followerId) => {
      return {
        recipient: followerId,
        sender: idUser,
        post: SharedPostSave._id,
        type: "shared_post",
        message: `${author.nickName} ha compartido un Post`,
      };
    });

    await Notification.insertMany(notifications); 

    return res.status(200).send({ message: SharedPostSave });
  } catch (error) {
    console.error("Error al compartir el post:", error);
    res.status(500).send({ message: "Error al compartir el post" });
  }
}

module.exports = sharePost;
