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

async function getTicketsByColletion(req, res) {
    try {
      const tickets = await TokenCollection.find({
        idCollection: req.params.idColletion,
      }).exec();
  
      if (!tickets) {
        return res.status(404).send({
          message: "No se encontro ningun token",
        });
      }
  
      res.status(200).send({ tickets });
    } catch (error) {
      console.error("Error al buscar tokens:", error);
      res.status(500).send({ error: "Hubo un error al buscar el token" });
    }
}

module.exports = { getTicketsByColletion }