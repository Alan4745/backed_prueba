/* eslint-disable no-unused-vars */
// const crypto = require("crypto");
// const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function findCollectionByUser(req, res) {
    try {
      // Buscar la colección por su nombre
      const collection = await Collections.find({ author: req.user.sub });
  
      if (collection) {
        // Si se encuentra la colección, devolverla en la respuesta
        return res.status(200).send({ message: collection });
      } else {
        // Si no se encuentra la colección, devolver un mensaje de error
        return res
          .status(404)
          .send({ message: "No se encontró ninguna colección con ese nombre." });
      }
    } catch (error) {
      // Manejar errores
      console.error("Error al buscar la colección:", error);
      return res.status(500).send({ message: "Error interno del servidor." });
    }
}

module.exports = { findCollectionByUser }