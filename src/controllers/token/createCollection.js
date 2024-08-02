/* eslint-disable no-unused-vars */
const crypto = require("crypto");
// const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function createCollection(req, res) {
    try {
      const modelCollections = new Collections();
      const idUsuario = req.user.sub;
  
      const parameters = req.body;
      const randomBytes = crypto.randomBytes(32).toString("hex");
      const hash = crypto
        .createHash("sha256")
        .update(parameters.nameCollection + randomBytes)
        .digest("hex");
  
      if (
        !parameters.nameCollection ||
        !parameters.desc
      ) {
        return res.status(500).send({ message: "Datos obligatorios faltantes" });
      }
  
      Collections.find(
        { nameCollection: parameters.nameCollection },
        async (err, collectionsName) => {
          if (collectionsName.length > 0) {
            return res
              .status(500)
              .send({ message: "Este nombre ya se está utilizando" });
          }
  
          modelCollections.hash = hash;
          modelCollections.nameCollection = parameters.nameCollection;
          modelCollections.desc = parameters.desc;
          modelCollections.author = idUsuario;
  
          if (req.files?.image) {
            // Subir la imagen a Cloudinary y obtener el resultado
            const result = await UploadImg(req.files.image.tempFilePath);
            // Guardar la información de la imagen en el modelo de usuario
  
            modelCollections.img.imgUrl = result.secure_url;
            modelCollections.img.imgId = result.public_id;
  
            // Verificar si el archivo temporal existe antes de intentar eliminarlo
            if (fs.existsSync(req.files.image.tempFilePath)) {
              await fs.unlink(req.files.image.tempFilePath);
            } else {
              console.warn("El archivo temporal no existe.");
            }
          }
  
          modelCollections.save((err, collectionSave) => {
            if (err || !collectionSave) {
              console.error(
                "Error al ejecutar la petición de guardar la colección:",
                err
              );
              return res
                .status(500)
                .send({ message: "Error al guardar la colección" });
            }
  
            return res.status(200).send({ message: collectionSave });
          });
        }
      );
    } catch (error) {
      console.error("Error al crear la colección:", error);
      return res
        .status(500)
        .send({ message: "Hubo un error al crear la colección" });
    }
  }

  module.exports = { createCollection }