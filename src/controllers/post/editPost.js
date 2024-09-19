const { Post, EventPost, PollPost, NormalPost } = require("../../models/post/posts.model");
const User = require("../../models/user.model");
const { UploadImg } = require("../../utils/cloudinary");
const fs = require("fs-extra");
const { Notification } = require("../../models/notification");

// EDITAR POST
async function editPost(req, res) {
    try {
        const { idUser, idPost } = req.params; // idUser y idPost deben pasarse en la ruta
        const { type } = req.body;

        // Encuentra el post existente
        let existingPost;
        if (type === "Event") {
            existingPost = await EventPost.findById(idPost);
        } else if (type === "Poll") {
            existingPost = await PollPost.findById(idPost);
        } else if (type === "Normal") {
            existingPost = await NormalPost.findById(idPost);
        } else {
            return res.status(400).send({ message: "Invalid post type." });
        }

        if (!existingPost) {
            return res.status(404).send({ message: "Post not found." });
        }

        let image = existingPost.image || {};
        let imagens = existingPost.pictures || [];

        // Actualiza la imagen principal si hay una nueva
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

        // Actualiza imágenes adicionales
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

        // Actualiza los campos según el tipo de post
        if (type === "Event") {
            existingPost.name = req.body.name || existingPost.name;
            existingPost.desc = req.body.desc || existingPost.desc;
            existingPost.price = req.body.price || existingPost.price;
            existingPost.fechaI = req.body.fechaI || existingPost.fechaI;
            existingPost.fechaF = req.body.fechaF || existingPost.fechaF;
            existingPost.req = req.body.req || existingPost.req;
            existingPost.coordinates = JSON.parse(req.body.coordinates) || existingPost.coordinates;
            existingPost.pictures = imagens;
        } else if (type === "Poll") {
            let options = req.body.options;
            if (typeof options === 'string') {
                try {
                    options = JSON.parse(options);
                } catch (error) {
                    options = options.split(',');
                }
            }
            existingPost.question = req.body.question || existingPost.question;
            existingPost.desc = req.body.desc || existingPost.desc;
            existingPost.price = req.body.price || existingPost.price;
            existingPost.coordinates = JSON.parse(req.body.coordinates) || existingPost.coordinates;
            existingPost.options = options || existingPost.options;
        } else if (type === "Normal") {
            existingPost.title = req.body.title || existingPost.title;
            existingPost.desc = req.body.desc || existingPost.desc;
            existingPost.price = req.body.price || existingPost.price;
            existingPost.coordinates = JSON.parse(req.body.coordinates) || existingPost.coordinates;
            existingPost.pictures = imagens;
        }

        // Guarda los cambios
        const updatedPost = await existingPost.save();
        if (!updatedPost) {
            return res.status(500).send({ message: "Error updating the POST." });
        }

        return res.status(200).send({ message: updatedPost });
    } catch (error) {
        res.status(500).send({ message: "Error al editar el post" });
    }
}

module.exports = editPost;
