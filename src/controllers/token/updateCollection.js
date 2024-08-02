/* eslint-disable no-unused-vars */
const crypto = require("crypto");
const Collections = require("../../models/tokens/collections.model");
const fs = require("fs-extra");
const { UploadImg } = require("../../utils/cloudinary");
const userModel = require("../../models/user.model");

async function updateCollection(req, res) {
  try {
    const collectionId = req.params.collectionId;
    const parameters = req.body;

    // Validación para el usuario y el evento
    if (!collectionId) {
      return res.status(500).json({ message: 'Tienes que enviar el id de la coleccion' });
    }

    const collectionFound = await Collections.findById(collectionId);
    if (!collectionFound) {
      return res.status(404).json({ message: 'La coleccion no fue encontrada' });
    }

    if (!parameters.author) {
      return res.status(500).json({ message: 'Tienes que enviar un autor' });
    }

    const authorFound = await userModel.findById(parameters.author);
    if (!authorFound) {
      return res.status(404).json({ message: 'usuario no encontrado' });
    }
    
    const equalAuthor = collectionFound.author.toString() === parameters.author;
    if (!equalAuthor) {
      return res.status(500).json({ message: 'este usuario no puede crear colecciones a este post' });
    }

    // Actualizar solo los campos proporcionados en la solicitud
    if (parameters.nameCollection) {
      collectionFound.nameCollection = parameters.nameCollection;
      // Generar un nuevo hash si se cambia el nombre de la colección
      const randomBytes = crypto.randomBytes(32).toString("hex");
      collectionFound.hash = crypto
        .createHash("sha256")
        .update(parameters.nameCollection + randomBytes)
        .digest("hex");
    }

    if (parameters.desc) {
      collectionFound.desc = parameters.desc;
    }

    if (req.files?.image) {
      // Subir la imagen a Cloudinary y obtener el resultado
      const result = await UploadImg(req.files.image.tempFilePath);
      // Guardar la información de la imagen en el modelo de colección
      collectionFound.img = {
        imgUrl: result.secure_url,
        imgId: result.public_id,
      };

      // Verificar si el archivo temporal existe antes de intentar eliminarlo
      if (fs.existsSync(req.files.image.tempFilePath)) {
        await fs.unlink(req.files.image.tempFilePath);
      } else {
        console.warn("El archivo temporal no existe.");
      }
    }

    const collectionSave = await collectionFound.save();

    res.status(200).send({ message: collectionSave });
  } catch (error) {
    console.error("Error al actualizar la colección:", error);
    return res
      .status(500)
      .send({ message: "Hubo un error al actualizar la colección" });
  }
}

module.exports = { updateCollection }