const Post = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { UploadImg } = require("../../utils/cloudinary");
const {
  Notification,
  createNotification,
} = require("../../models/notification");
const fs = require("fs-extra");

// HACER POST
async function createPost(req, res) {
  console.log("createPost");
  try {
    const newPost = new Post();

    // id del autor pasado como parámetro
    const { idUser } = req.params;
    let image = {};
    let imagens = [];

    const { type } = req.body;

    if (req.files?.image) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario

      image.public_id = result.public_id;
      image.secure_url = result.secure_url;

      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image.tempFilePath)) {
        await fs.unlink(req.files.image.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    if (req.files?.image1) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image1.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario

      imagens.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image1.tempFilePath)) {
        await fs.unlink(req.files.image1.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    if (req.files?.image2) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image2.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario

      imagens.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image2.tempFilePath)) {
        await fs.unlink(req.files.image2.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    if (req.files?.image3) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image3.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario

      imagens.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image3.tempFilePath)) {
        await fs.unlink(req.files.image3.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    if (req.files?.image4) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image4.tempFilePath);
      // Guardar la información de la imagen en el modelo de usuario

      imagens.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image4.tempFilePath)) {
        await fs.unlink(req.files.image4.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    const content = {};

    newPost.author = idUser;
    newPost.image = image;
    newPost.type = type;

    console.log("content", content);
    // console.log('body', req.body);
    // console.log('type', type);

    if (type === "Event") {
      content.name = req.body.name;
      content.desc = req.body.desc;
      content.fechaI = JSON.parse(req.body.fechaI);
      content.fechaF = JSON.parse(req.body.fechaF);
      content.req = JSON.parse(req.body.req);
      if (JSON.parse(req.body.coordinates)) {
        content.coordinates = JSON.parse(req.body.coordinates);
      }
      if (JSON.parse(req.body.ubicacion)) {
        content.ubicacion = JSON.parse(req.body.ubicacion);
      }
      content.pictures = imagens;
    } else if (type === "Poll") {
      console.log(req.body.options);
      content.question = req.body.question;
      content.desc = req.body.desc;
      content.options = JSON.parse(req.body.options);
      content.votes = {
        option1: [""],
        option2: [""],
        option3: [""],
        option4: [""],
      };
    } else if (type === "Normal") {
      content.title = req.body.title;
      content.desc = req.body.desc;
      content.pictures = imagens;
    }

    console.log("content", content);

    newPost.content = content;

    console.log("newPost", newPost);

    const PostSave = await newPost.save();
    // Verificar si la operación de guardado fue exitosa
    if (!PostSave) {
      return res.status(500).send({ message: "Error saving the POST." });
    }

    // Obtener el autor del post y sus seguidores
    const author = await User.findById(idUser);
    if (!author) {
      return res.status(404).send({ message: "User not found." });
    }

    const notifications = author.followers.map((followerId) => {
      return {
        recipient: followerId,
        sender: idUser,
        post: PostSave._id,
        type: "new_post",
        message: `${author.nickName} ha publicado un nuevo Post ${PostSave.type}`,
      };
    });

    // Crear las notificaciones
    await Notification.insertMany(notifications);

    return res.status(200).send({ message: PostSave });
  } catch (error) {
    console.error("Error al crear el post:", error);
    // Enviar una respuesta de error con el mensaje de error
    res.status(500).send({ message: "Error al crear el post" });
  }
}

//Obtener todos los post
async function getAllPosts(req, res) {
  try {
    const latestPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(15)
      .exec();

    // console.log(latestPosts);

    return res.status(200).send({ message: latestPosts });
  } catch (err) {
    console.error("Error", err);
    res.status(500).send({ message: "Error al obtener" });
  }
}

async function getFeedPosts(req, res) {
  console.log("getFeedPosts");
  try {
    const authorsId = req.query.authorsId; // Access query parameters
    const authorsIdSplit = authorsId.split(",");
    console.log("Authors IDs:", authorsIdSplit);
    console.log("Authors IDs:", typeof authorsIdSplit);
    // const {authorsId} = JSON.parse(req.headers.data);
    // console.log(authorsId);

    const latestPosts = await Post.find({ author: { $in: authorsIdSplit } })
      .sort({ createdAt: -1 })
      .limit(15)
      .exec();

    // console.log(latestPosts);

    return res.status(200).send({ message: latestPosts });
  } catch (err) {
    console.error("Error", err);
    res.status(500).send({ message: "Error al obtener" });
  }
}

// TRAER LOS POST DE LAS PERSONAS QUE SIGUES
async function getPostFollowing(req, res) {
  console.log("getPostFollowing");
  const { page = 1, limit = 10 } = req.query;

  const user = await User.findById(req.user.sub);
  const followingIds = user.following;
  console.log(followingIds);

  try {
    followingIds.push(req.user.sub);
    // Obtener los posts de los seguidores con paginación
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
    res
      .status(500)
      .json({ error: "Error al obtener los posts de los seguidores." });
  }
}

// TRAER MI POST
async function getPost(req, res) {
  console.log("getPost");

  const Id_Post = req.params.idPost;
  const idUser = req.user.sub;

  console.log(idUser);
  console.log(Id_Post);

  try {
    const post = await Post.findOne({ _id: Id_Post, author: idUser });

    if (!post) {
      return res
        .status(404)
        .json({ error: "Post no encontrado o no te pertenece." });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Post." });
    console.log(error);
  }
}

//Traer post por usuarios
async function getPostByUser(req, res) {
  console.log("getPostByUser");

  const idUser = req.params.idUser;

  try {
    const post = await Post.find({ author: idUser });

    if (!post) {
      return res
        .status(404)
        .json({ error: "Post no encontrado o no te pertenece." });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el Post." });
    console.log(error);
  }
}

//Obtener un post publico por id sin autorización
async function getPublicPost(req, res) {
  console.log("getPublicPost");

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

// ACTUALIZAR POST O EVENTOS
async function updatePost(req, res) {
  const idPost = req.params.idPost; // ID del post a actualizar
  let image = {};
  let imagens = [];

  try {
    const post = await Post.findOne({ _id: idPost, author: req.user.sub });

    console.log(req.files);

    // Obtener el post existente
    const type = post.type;
    if (!post) {
      return res
        .status(404)
        .send({ message: "Post no encontrado o no te pertenece el Post." });
    }

    // Subir y gestionar imágenes si están presentes en la solicitud
    if (req.files?.image) {
      const result = await UploadImg(req.files.image.tempFilePath);
      image.public_id = result.public_id;
      image.secure_url = result.secure_url;
      if (fs.existsSync(req.files.image.tempFilePath)) {
        await fs.unlink(req.files.image.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    // Subir imágenes adicionales
    const uploadAdditionalImages = async (imageField) => {
      if (req.files?.[imageField]) {
        const result = await UploadImg(req.files[imageField].tempFilePath);
        imagens.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
        if (fs.existsSync(req.files[imageField].tempFilePath)) {
          await fs.unlink(req.files[imageField].tempFilePath);
        } else {
          console.warn(`El archivo temporal ${imageField} no existe.`);
        }
      }
    };

    await Promise.all(
      ["image1", "image2", "image3", "image4"].map(uploadAdditionalImages)
    );

    const content = {};

    // Actualizar los campos del post existente
    if (image.secure_url) post.image = image;
    post.type = type || post.type;

    if (type === "Event") {
      content.name = req.body.name;
      content.desc = req.body.desc;
      content.fechaI = JSON.parse(req.body.fechaI);
      content.fechaF = JSON.parse(req.body.fechaF);
      content.req = JSON.parse(req.body.req);
      if (JSON.parse(req.body.coordinates)) {
        content.coordinates = JSON.parse(req.body.coordinates);
      }
      if (JSON.parse(req.body.ubicacion)) {
        content.ubicacion = JSON.parse(req.body.ubicacion);
      }
      content.pictures = imagens.length ? imagens : post.content.pictures;
    } else if (type === "Poll") {
      content.question = req.body.question;
      content.desc = req.body.desc;
      content.options = JSON.parse(req.body.options);
      content.votes = post.content.votes || {
        option1: [""],
        option2: [""],
        option3: [""],
        option4: [""],
      };
    } else if (type === "Normal") {
      content.title = req.body.title;
      content.desc = req.body.desc;
      content.pictures = imagens.length ? imagens : post.content.pictures;
    }

    post.content = content;

    const postSave = await post.save();
    if (!postSave) {
      return res.status(500).send({ message: "Error al guardar el post." });
    }
    return res.status(200).send({ message: postSave });
  } catch (error) {
    console.error("Error al actualizar el post:", error);
    res.status(500).send({ message: "Error al actualizar el post" });
  }
}

// COMPARTIR POST
async function sharePost(req, res) {
  const postId = req.params.idPost; // ID del post a compartir
  const userId = req.user.sub; // ID del usuario que comparte el post
  console.log(postId);

  try {
    // Encuentra el post original
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      return res.status(404).json({ error: "Post original no encontrado." });
    }

    // Crea un nuevo post con referencia al post original
    const sharedPost = new Post({
      author: userId,
      image: originalPost.image,
      type: originalPost.type,
      content: originalPost.content,
      comments: [],
      likes: [],
      originalPost: originalPost._id,
      createdAt: Date.now(),
    });
    // Guarda el nuevo post en la base de datos
    await sharedPost.save();

    // Crear una notificación para el autor del post original
    await createNotification(
      originalPost.author,
      userId,
      originalPost._id,
      "share",
      `${req.user.nickName} ha compartido tu post. ${sharedPost.type}`
    );

    res.status(200).json(sharedPost);
  } catch (error) {
    console.error("Error al compartir el post:", error);
    res.status(500).json({ error: "Error al compartir el post." });
  }
}

// COMENTARIO POST
async function commentsPost(req, res) {
  const postId = req.params.idPost;
  const params = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Crear el nuevo comentario
    const newComment = {
      userId: req.user.sub,
      text: params.text,
      date: Date.now(),
    };

    // Agregar el comentario al post
    post.comments.push(newComment);
    await post.save();

    // Crear una notificación
    await createNotification(
      post.author,
      req.user.sub,
      post._id,
      "share",
      `Nuevo comentario de ${req.user.nickName}: ${newComment.text}`
    );

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// REACCIONAR POST
async function reactPost(req, res) {
  const postId = req.params.idPost;
  const params = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Crear el nuevo comentario
    const newComment = {
      userId: req.user.sub,
      text: params.text,
      date: Date.now(),
    };

    // Agregar el comentario al post
    post.comments.push(newComment);
    await post.save();

    // Crear una notificación
    await createNotification(
      post.author,
      req.user.sub,
      post._id,
      "share",
      `Nuevo comentario de ${req.user.nickName}: ${newComment.text}`
    );

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// RACION POST

//TRAER COMENTARIOS
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

//Eliminar post
async function deletePost(req, res) {
  console.log("deletePost");

  const idPost = req.params.idPost; // ID del post a eliminar

  try {
    //Eliminar el post y el resultado
    const postDeleted = await Post.findByIdAndDelete({
      _id: idPost,
      author: req.user.sub,
    });

    // Verificar si la eliminación fue exitosa
    if (!postDeleted) {
      return res.status(500).send({ message: "Error al eliminar el post." });
    }

    // Enviar la información del usuario eliminado
    return res.status(200).send({ message: "Post eliminado." });
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(500).send({ message: "Error al eliminar el post" });
  }
}

module.exports = {
  createPost,
  getFeedPosts,
  getAllPosts,
  getPostFollowing,
  getPost,
  reactPost,
  getPostByUser,
  getPublicPost,
  updatePost,
  sharePost,
  commentsPost,
  getCommentsPost,
  deletePost,
};
