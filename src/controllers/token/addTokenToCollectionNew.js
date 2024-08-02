/* eslint-disable no-unused-vars */
const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function addTokenToCollectionNew(req, res) {
    try {
      const parameters = req.body;
      const { tokenAmount, colletionId,name,title,desc,price } = parameters;
      const tokens = [];
      let result = {};
  
      if (tokenAmount > 1000) {
        return res.status(500).send({ message: "Se supera el límite permitido" });
      }
  
      const collectionFind = await Collections.findOne({
        author: req.user.sub,
        _id: colletionId,
      });
  
  
      if (!collectionFind) {
        return res
          .status(500)
          .send({ message: "Error, no se encontro la coleccion." });
      }
  
      const findToken = await TokenCollection.find({idCollection: colletionId});
  
      if (req.files?.image) {
        // Subir la imagen a Cloudinary y obtener el resultado
        result = await UploadImg(req.files.image.tempFilePath);
        // Guardar la información de la imagen en el modelo de usuario
  
        // Verificar si el archivo temporal existe antes de intentar eliminarlo
        if (fs.existsSync(req.files.image.tempFilePath)) {
          await fs.unlink(req.files.image.tempFilePath);
        } else {
          console.warn("El archivo temporal no existe.");
        }
      }
  
      for (let i = 0; i < tokenAmount; i++) {
        const modelToken = new TokenCollection();
        const randomBytes = crypto.randomBytes(32).toString("hex");
        const hash = crypto
          .createHash("sha256")
          .update(name + randomBytes)
          .digest("hex");
  
        modelToken.hash = hash;
        modelToken.title = title;
        modelToken.desc = desc;
        modelToken.author = req.user.sub;
        modelToken.price = price * 100;
        modelToken.idCollection = colletionId;
        
        if(findToken && findToken.length > 0){
          modelToken.numertoken = findToken.length + i + 1;
        } else {
          modelToken.numertoken = i + 1;
        }
        
        modelToken.img.imgUrl = result.secure_url;
        modelToken.img.imgId = result.public_id;
  
        tokens.push(modelToken);
      }
  
      await TokenCollection.insertMany(tokens);
      return res.status(200).send({
        message: `${tokenAmount} tokens creados y guardados exitosamente.`,
      });
    } catch (error) {
      console.error("Error al agregar tokens a la colección:", error);
      return res
        .status(500)
        .send({ error: "Hubo un error al agregar tokens a la colección" });
    }
}

  module.exports = { addTokenToCollectionNew }