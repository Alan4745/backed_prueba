/* eslint-disable no-unused-vars */
const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
// const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function viewToken(req, res) {
    try {
      const tokensFid = await TokenCollection.find({
        author: req.params.author,
        adquirido: false, // Filtrar por tokens no adquiridos
      }).exec();
  
      if (tokensFid.length === 0) {
        return res.status(404).send({
          message: "No se encontraron tokens no adquiridos para esta colección",
        });
      }
  
      res.status(200).send({ message: tokensFid });
    } catch (error) {
      console.error("Error al buscar tokens:", error);
      res.status(500).send({ error: "Hubo un error al buscar tokens" });
    }
}

  module.exports = { viewToken }