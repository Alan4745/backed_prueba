const { Post } = require("../../models/post/posts.model");
const { Notification, createNotification } = require("../../models/notification");

async function reactPost(req, res) {
  console.log("reactPost");

  const { idPost } = req.params;
  const { idUser } = req.params;
  const { reactionType } = req.body;

  try {
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).send({ message: "Post no encontrado." });
    }

    const existingReaction = post.reactions.find(
      (reaction) => reaction.user.toString() === idUser
    );

    if (existingReaction) {
      existingReaction.type = reactionType;
    } else {
      post.reactions.push({ user: idUser, type: reactionType });
    }

    await post.save();

    const notification = await createNotification({
      recipient: post.author,
      sender: idUser,
      post: idPost,
      type: "reaction",
      message: `A alguien le ha ${reactionType} tu Post`,
    });

    return res.status(200).send({ message: post });
  } catch (error) {
    console.error("Error al reaccionar al post:", error);
    res.status(500).send({ message: "Error al reaccionar al post" });
  }
}

module.exports = reactPost;
