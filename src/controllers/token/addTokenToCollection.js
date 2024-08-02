const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function addTokenToCollection(req, res) {
  try {
    const parameters = req.body;
    const { tokenAmount } = parameters;
    const tokens = [];
    let result = {};

    const community = await Community.findOne({
      nameCommunity: parameters.nameCommunity,
      nameOwner: req.user.nickName,
    });

    if (!community) {
      return res
        .status(500)
        .send({ message: "Esta comunidad no te pertenece" });
    }

    if (tokenAmount > 1000) {
      return res.status(500).send({ message: "Se supera el límite permitido" });
    }

    const collectionFind = await Collections.findOne({
      author: parameters.nameCommunity,
      nameCollection: parameters.nameCollection,
    });

    console.log(parameters.nameCollection, "nameCollection");
    console.log(parameters.nameCommunity, "nameCommunity");

    if (!collectionFind) {
      return res
        .status(500)
        .send({ message: "Error, no se encontraron similitudes" });
    }

    const tokenFind = await TokenCollection.find({
      author: parameters.nameCommunity,
      idCollection: collectionFind._id,
    });

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
        .update(parameters.name + randomBytes)
        .digest("hex");

      modelToken.hash = hash;
      modelToken.title = parameters.title;
      modelToken.desc = parameters.desc;
      modelToken.numertoken = tokenFind.length + i + 1;
      modelToken.idCollection = collectionFind._id;
      modelToken.author = parameters.nameCommunity;
      modelToken.price = parameters.price * 100;

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

module.exports = { addTokenToCollection }