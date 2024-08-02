/* eslint-disable no-unused-vars */
// const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
// const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
// const User = require("../../models/user.model");
const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function burnTicket(req, res) {
    try {
      const idDocumento = req.params.idTicket; // ID del documento a actualizar
  
      console.log(idDocumento);
      // Validar si el ID es válido
      if (!idDocumento) {
        return res
          .status(400)
          .send({ message: "Se requiere un ID de documento válido." });
      }
  
      // Buscar el ticket en la base de datos
      const ticket = await TokenCollection.findById(idDocumento);
  
      // Comprobar si el ticket existe
      if (!ticket) {
        return res
          .status(404)
          .send({ message: "No se encontró ningún ticket con ese ID." });
      }
  
      // Comprobar si el ticket ya ha sido canjeado
      if (ticket.canjeado) {
        return res
          .status(400)
          .send({ message: "El ticket ya ha sido canjeado." });
      }
  
      // Actualizar el documento
      const documentoActualizado = await TokenCollection.findByIdAndUpdate(
        idDocumento,
        { canjeado: true },
        { new: true }
      );
  
      // Comprobar si se actualizó el documento
      if (!documentoActualizado) {
        return res
          .status(404)
          .send({ message: "No se encontró ningún documento con ese ID." });
      }
      // io.on('connection', (socket) => {
      // 	console.log('Un cliente se ha conectado');
      // });
      // io.on('documentoActualizado', { documento: documentoActualizado });
      console.log(io);
      res.status(200).send({
        message: "Documento actualizado con éxito.",
        documento: documentoActualizado,
      });
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      res.status(500).send({ message: "Error interno del servidor." });
    }
}

module.exports = { burnTicket }