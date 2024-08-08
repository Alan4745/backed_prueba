const { EventPost, PollPost, NormalPost, Post } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { UploadImg } = require("../../utils/cloudinary");
const fs = require("fs-extra");
const { Notification } = require("../../models/notification");

async function updatePost(req, res) {
  try {
    const idUser = req.user.sub;
    const postId = req.params.idPost;
    const { type } = req.body;

    let updateData = {};
    let image = {};
    let imagens = [];

    if (req.files?.image) {
      const result = await UploadImg(req.files.image.tempFilePath);
      image.public_id = result.public_id;
      image.secure_url = result.secure_url;
      updateData.image = image;
      if (fs.existsSync(req.files.image.tempFilePath)) {
        await fs.unlink(req.files.image.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

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

    if (type === "Event") {
      updateData = {
        ...updateData,
        name: req.body.name,
        desc: req.body.desc,
        fechaI: req.body.fechaI,
        fechaF: req.body.fechaF,
        req: req.body.req,
        coordinates: req.body.coordinates,
        ubicacion: req.body.ubicacion,
        pictures: imagens,
      };
    } else if (type === "Poll") {
      updateData = {
        ...updateData,
        question: req.body.question,
        desc: req.body.desc,
        options: JSON.parse(req.body.options),
      };
    } else if (type === "Normal") {
      updateData = {
        ...updateData,
        title: req.body.title,
        desc: req.body.desc,
        pictures: imagens,
      };
    } else {
      return res.status(400).send({ message: "Invalid post type." });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });

    if (!updatedPost) {
      return res.status(500).send({ message: "Error al actualizar el post." });
    }

    return res.status(200).send({ message: updatedPost });
  } catch (error) {
    console.error("Error al actualizar el post:", error);
    res.status(500).send({ message: "Error al actualizar el post" });
  }
}

module.exports = updatePost;
