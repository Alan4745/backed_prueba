/* eslint-disable no-unused-vars */
const crypto = require("crypto");
const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
const fs = require("fs-extra");
const { UploadImg } = require("../../utils/cloudinary");
const { default: mongoose } = require("mongoose");
const { Post } = require("../../models/post/posts.model");
const userModel = require("../../models/user.model");

async function createCollectionWithTickets(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      author,
      idPost,
      nameCollection,
      desc,
      title,
      subTitle,
      ticketDesc,
      price,
      tokenAmount,
    } = req.body;

    const collectionImg = req.files?.collectionImg;
    const ticketImg = req.files?.ticketImg;

    // Validación para el usuario y el evento
    if (!idPost) {
      return res.status(500).json({ message: 'Tienes que enviar el id del post' });
    }

    const postFound = await Post.findById(idPost);
    if (!postFound) {
      return res.status(404).json({ message: 'El post no fue encontrado' });
    }

    if (!author) {
      return res.status(500).json({ message: 'Tienes que enviar un autor' });
    }

    const authorFound = await userModel.findById(author);
    if (!authorFound) {
      return res.status(404).json({ message: 'usuario no encontrado' });
    }

    if (postFound.author !== author) {
      return res.status(500).json({ message: 'este usuario no puede crear colecciones a este post' });
    }

    // Subir la imagen de la colección si está presente
    let collectionImgResult = null;
    if (collectionImg) {
      collectionImgResult = await UploadImg(collectionImg.tempFilePath);
    }

    // Crear la colección
    const collection = new Collections({
      hash: crypto.randomBytes(16).toString("hex"),
      nameCollection,
      desc,
      img: collectionImgResult ? {
        imgUrl: collectionImgResult.secure_url,
        imgId: collectionImgResult.public_id,
      } : null,
      author,
      idPost,
    });

    const savedCollection = await collection.save({ session });

    // Subir la imagen de los tickets si está presente
    let ticketImgResult = null;
    if (ticketImg) {
      ticketImgResult = await UploadImg(ticketImg.tempFilePath);
    }

    // Generar tickets
    const tickets = [];
    for (let i = 0; i < tokenAmount; i++) {
      const randomBytes = crypto.randomBytes(32).toString("hex");
      const hash = crypto
        .createHash("sha256")
        .update(nameCollection + randomBytes)
        .digest("hex");

      const ticket = new TokenCollection({
        hash: hash,
        numertoken: i + 1,
        title: title,
        subTitle: subTitle,
        desc: ticketDesc,
        img: ticketImgResult ? {
          imgUrl: ticketImgResult.secure_url,
          imgId: ticketImgResult.public_id,
        } : null,
        price: price * 100,
        author: author,
        idPost,
        idCollection: savedCollection._id,
      });

      tickets.push(ticket);
    }
    const savedTickets = await TokenCollection.insertMany(tickets, { session });

    await session.commitTransaction();
    session.endSession();

    // Eliminar archivos temporales si existen
    if (collectionImg && fs.existsSync(collectionImg.tempFilePath)) {
      await fs.unlink(collectionImg.tempFilePath);
    }
    if (ticketImg && fs.existsSync(ticketImg.tempFilePath)) {
      await fs.unlink(ticketImg.tempFilePath);
    }

    // Seleccionar solo el primer y el último ticket para la respuesta
    const responseTickets = [savedTickets[0], savedTickets[savedTickets.length - 1]];

    res.status(201).json({ collection: savedCollection, tickets: responseTickets });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Error creating collection and tickets", error });
  }
}

module.exports = { createCollectionWithTickets }