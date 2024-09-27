const { Post } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const Collections = require("../../models/tokens/collections.model");
const TokenCollection = require("../../models/tokens/tokenCollection.model");

async function getAllPosts(req, res) {
  try {
    const allPosts = await Post.find();

    const results = await Promise.all(allPosts.map(async (post) => {
      let collectionFound = await Collections.findOne({ idPost: post._id });

      // Buscar el usuario correspondiente
      const user = await User.findById(post.author, { password: 0 });

      // Manejar el caso en que el usuario no se encuentre
      let dataAuthor = {
        image: { public_id: "", secure_url: "" },
        author: "Usuario desconocido",
        authorName: "Usuario desconocido"
      };

      if (user) {
        // Si el usuario existe, actualizar dataAuthor
        dataAuthor = {
          image: user.imageAvatar ? {
            public_id: user.imageAvatar.public_id,
            secure_url: user.imageAvatar.secure_url
          } : { public_id: "", secure_url: "" },
          author: user.name,
          authorName: user.name
        };
      }

      // Modificar el objeto post para incluir dataAuthor
      post.dataAuthor = dataAuthor;

      if (!collectionFound) {
        collectionFound = { message: "Colección no encontrada." };
      }

      const ticketsFounds = await TokenCollection.find({ idCollection: collectionFound._id });
      const numberOfTickets = ticketsFounds.length;
      const numberLikes = post.likes.length;

      return {
        post,
        numberLikes,
        collectionFound,
        numberOfTickets
      };
    }));

    return res.status(200).json({ message: "Posts encontrados", results });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ message: "Error al obtener los posts", error: err.message });
  }
}

async function getFeedPosts(req, res) {
  try {
    const authorsId = req.query.authorsId;
    const authorsIdSplit = authorsId.split(",");
    const latestPosts = await Post.find({ author: { $in: authorsIdSplit } })
      .sort({ createdAt: -1 })
      .limit(15)
      .exec();
    return res.status(200).send({ message: latestPosts });
  } catch (err) {
    console.error("Error", err);
    res.status(500).send({ message: "Error al obtener" });
  }
}

async function getPostFollowing(req, res) {
  const { page = 1, limit = 10 } = req.query;
  const user = await User.findById(req.user.sub);
  const followingIds = user.following;
  try {
    followingIds.push(req.user.sub);
    const posts = await Post.find({ author: { $in: followingIds } })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Post.countDocuments();
    res.status(200).json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los posts de los seguidores." });
  }
}

async function getPost(req, res) {
  const Id_Post = req.params.idPost;
  const idUser = req.user.sub;
  try {
    const post = await Post.findOne({ _id: Id_Post, author: idUser });
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado o no te pertenece." });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Post." });
    console.log(error);
  }
}

async function getPostByUser(req, res) {
  const idUser = req.params.idUser;
  try {
    const post = await Post.find({ author: idUser });
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado o no te pertenece." });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Post." });
    console.log(error);
  }
}

async function getPublicPost(req, res) {
  const Id_Post = req.params.idPost;
  try {
    const post = await Post.findOne({ _id: Id_Post });
    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Post." });
    console.log(error);
  }
}

module.exports = {
  getAllPosts,
  getFeedPosts,
  getPostFollowing,
  getPost,
  getPostByUser,
  getPublicPost,
};
