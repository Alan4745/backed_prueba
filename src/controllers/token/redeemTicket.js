/* eslint-disable no-unused-vars */
// const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
// const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
const User = require("../../models/user.model");
// const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

async function redeemTicket(req, res) {
    try {
      const idTicket = req.params.idTicket;
      const idUsuario = req.user.sub;
  
      const nuevoBuyerId = req.body.buyerid;
  
      // Validar si los IDs son válidos
      if (!idTicket || !idUsuario) {
        return res
          .status(400)
          .send({ message: "Se requieren IDs de ticket y usuario válidos." });
      }
  
      // Verificar si el usuario ya ha adquirido el ticket
      const usuario = await User.findById(idUsuario);
      if (!usuario) {
        return res
          .status(404)
          .send({ message: "No se encontró ningún usuario con ese ID." });
      }
      if (usuario.ticketsObtained.includes(idTicket)) {
        return res
          .status(400)
          .send({ message: "El usuario ya ha adquirido este ticket." });
      }
  
      // Actualizar el ticket
      const ticketActualizado = await TokenCollection.findByIdAndUpdate(
        idTicket,
        { buyerid: nuevoBuyerId, adquirido: true },
        { new: true }
      );
  
      if (!ticketActualizado) {
        return res
          .status(404)
          .send({ message: "No se encontró ningún ticket con ese ID." });
      }
  
      // Agregar el ticket a los tokens obtenidos del usuario
      usuario.ticketsObtained.push(ticketActualizado);
  
      // Guardar los cambios en el usuario
      await usuario.save();
  
      res.status(200).send({
        message: "Ticket redimido exitosamente.",
        ticket: ticketActualizado,
      });
    } catch (error) {
      console.error("Error al redimir el ticket:", error);
      res.status(500).send({ message: "Error interno del servidor." });
    }
}

module.exports = { redeemTicket }