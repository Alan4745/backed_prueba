/* eslint-disable no-unused-vars */
// const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
// const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function deleteOneTicket(req, res) {
    try {
      const idTicket = req.params.idTicket; // ID del documento a eliminar
  
      // Buscar el ticket en la base de datos
      const ticket = await TokenCollection.findByIdAndDelete({_id: idTicket});
  
      // Comprobar si el ticket existe
      if (!ticket) {
        return res
          .status(404)
          .send({ message: "No se encontró ningún ticket con ese ID." });
      }
  
      res.status(200).send({
        message: "Ticket eliminado exitosamente."
      });
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      res.status(500).send({ message: "Error interno del servidor." });
    }
}

module.exports= { deleteOneTicket }