const { Post, EventPost, PollPost, NormalPost } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { UploadImg, UploadVideo } = require("../../utils/cloudinary");
const fs = require("fs-extra");
const { Notification, createNotification } = require("../../models/notification");

// HACER POST
async function createPost(req, res) {
  try {
    const { idUser } = req.params;
    const { type } = req.body;

    let image = {};
    let imagens = [];
    let video = {};

    // Cargar imagen
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

    // Cargar múltiples imágenes
    const imageFields = ['image1', 'image2', 'image3', 'image4'];
    for (const field of imageFields) {
      if (req.files?.[field]) {
        const result = await UploadImg(req.files[field].tempFilePath);
        imagens.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
        if (fs.existsSync(req.files[field].tempFilePath)) {
          await fs.unlink(req.files[field].tempFilePath);
        } else {
          console.warn("El archivo temporal no existe.");
        }
      }
    }

    // Cargar video
    if (req.files?.video) {
      const result = await UploadVideo(req.files.video.tempFilePath);
      video.public_id = result.public_id;
      video.secure_url = result.secure_url;
      if (fs.existsSync(req.files.video.tempFilePath)) {
        await fs.unlink(req.files.video.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    let newPost;
    if (type === "Event") {
      newPost = new EventPost({
        author: idUser,
        image: image,
        video: video, // Agregar video al evento
        name: req.body.name,
        desc: req.body.desc,
        price: req.body.price,
        fechaI: req.body.fechaI,
        fechaF: req.body.fechaF,
        req: req.body.req,
        coordinates: JSON.parse(req.body.coordinates),
        pictures: imagens,
      });
    } else if (type === "Poll") {
      let options = req.body.options;
      if (typeof options === 'string') {
        try {
          options = JSON.parse(options);
        } catch (error) {
          options = options.split(','); // Si falla la conversión, intenta dividir por comas
        }
      }
      newPost = new PollPost({
        author: idUser,
        image: image,
        question: req.body.question,
        desc: req.body.desc,
        price: req.body.price,
        coordinates: JSON.parse(req.body.coordinates),
        options: options,
        votes: {
          option1: [""],
          option2: [""],
          option3: [""],
          option4: [""],
        },
      });
    } else if (type === "Normal") {
      newPost = new NormalPost({
        author: idUser,
        image: image,
        video: video, // Agregar video si existe
        title: req.body.title,
        desc: req.body.desc,
        price: req.body.price,
        coordinates: JSON.parse(req.body.coordinates),
        pictures: imagens,
      });
    } else {
      return res.status(400).send({ message: "Invalid post type." });
    }

    const PostSave = await newPost.save();
    if (!PostSave) {
      return res.status(500).send({ message: "Error saving the POST." });
    }

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

    await Notification.insertMany(notifications);
    console.log(PostSave);

    return res.status(200).send({ message: PostSave });
  } catch (error) {
    console.error("Error al crear el post:", error);
    res.status(500).send({ message: "Error al crear el post" });
  }
}

module.exports = createPost;
