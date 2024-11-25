const { Note } = require("../../models/note/note.model");
const userModel = require("../../models/user.model");

// Crear una nueva nota
const createNewNote = async (req, res) => {
  try {
    const { senderId, reciverId, type, noteContent, statusNote, coordinates } =
      req.body;

    const userSender = await userModel.findById(senderId);
    const userReciver = await userModel.findById(reciverId);
    if (!userSender) {
      return res
        .status(404)
        .json({ message: "No se encontró al usuario remitente" });
    }
    if (!userReciver) {
      return res
        .status(404)
        .json({ message: "No se encontró al usuario receptor" });
    }

    const newNote = await Note.create({
      senderId,
      reciverId,
      type,
      noteContent,
      statusNote,
      coordinates,
    });
    res.status(201).json({ message: "Nota creada con éxito", newNote });
  } catch (error) {
    console.error("Error al crear una nota:", error);
    res.status(500).json({ message: "Error al crear nota", error });
  }
};

// Función para aplicar anonimato si statusNote es "anonymous"
const applyAnonymity = (notes) => {
  return notes.map((note) => {
    if (note.statusNote === "anonymous") {
      note.senderId = {
        name: "Anonymous",
        imageAvatar: {
          public_id: {
            type: "",
            default: "",
          },
          secure_url: {
            type: "",
            default: "",
          },
        },
      };
    }
    return note;
  });
};

const toggleLikeNote = async (req, res) => {
  try {
    const { userId, noteId } = req.body; // ID del usuario

    // Verificar si la nota existe
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // Verificar si el usuario ya dio "like"
    const likeIndex = note.likes.findIndex((like) => like.userId === userId);

    if (likeIndex !== -1) {
      // Si ya dio "like", eliminar el "like"
      note.likes.splice(likeIndex, 1);
      await note.save();
      return res
        .status(200)
        .json({ message: "Like eliminado con éxito", note });
    }

    // Si no dio "like", agregar el "like"
    note.likes.push({ userId });
    await note.save();
    res.status(200).json({ message: "Like agregado con éxito", note });
  } catch (error) {
    console.error("Error al alternar 'like' en una nota:", error);
    res.status(500).json({ message: "Error al alternar 'like'", error });
  }
};

const addCommentToNote = async (req, res) => {
  try {
    const { userId, noteId, text, rating } = req.body; // Datos del comentario

    // Verificar si la nota existe
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // Crear un nuevo comentario
    const newComment = {
      userId,
      text,
      date: new Date().toISOString(), // Fecha actual
      rating, // Valoración opcional
    };

    // Agregar el comentario a la nota
    note.comments.push(newComment);
    await note.save();

    res.status(201).json({ message: "Comentario agregado con éxito", note });
  } catch (error) {
    console.error("Error al agregar un comentario a la nota:", error);
    res.status(500).json({ message: "Error al agregar el comentario", error });
  }
};

const toggleSaveNote = async (req, res) => {
  try {
    const { userId, noteId } = req.body; // ID del usuario que intenta guardar/desguardar la nota

    // Verificar si la nota existe
    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // Verificar si el usuario es el receptor de la nota
    if (note.reciverId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para guardar esta nota" });
    }

    // Alternar el estado de "save"
    note.saveStatus = !note.saveStatus;
    await note.save();

    res.status(200).json({
      message: `Nota ${note.save ? "guardada" : "desguardada"} con éxito`,
      note,
    });
  } catch (error) {
    console.error("Error al alternar el estado de guardado:", error);
    res
      .status(500)
      .json({ message: "Error al alternar el estado de guardado", error });
  }
};

// Obtener todas las notas con información del remitente y receptor
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("senderId", "name imageAvatar")
      .populate("reciverId", "name imageAvatar");

    res.status(200).json({ notes: applyAnonymity(notes) });
  } catch (error) {
    console.error("Error al obtener todas las notas:", error);
    res.status(500).json({ message: "Error al obtener las notas", error });
  }
};

// Obtener notas enviadas por el usuario con información del remitente y receptor
const getSentNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ senderId: userId })
      .populate("senderId", "name imageAvatar")
      .populate("reciverId", "name imageAvatar");

    if (!notes.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron notas enviadas por este usuario" });
    }

    res.status(200).json({ notes: applyAnonymity(notes) });
  } catch (error) {
    console.error("Error al obtener notas enviadas por el usuario:", error);
    res.status(500).json({ message: "Error al obtener notas enviadas", error });
  }
};

// Obtener notas recibidas por el usuario con información del remitente y receptor
const getReceivedNotesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const notes = await Note.find({ reciverId: userId })
      .populate("senderId", "name imageAvatar")
      .populate("reciverId", "name imageAvatar");

    if (!notes.length) {
      return res.status(404).json({
        message: "No se encontraron notas recibidas por este usuario",
      });
    }

    res.status(200).json({ notes: applyAnonymity(notes) });
  } catch (error) {
    console.error("Error al obtener notas recibidas por el usuario:", error);
    res
      .status(500)
      .json({ message: "Error al obtener notas recibidas", error });
  }
};

module.exports = {
  createNewNote,
  toggleLikeNote,
  toggleSaveNote,
  addCommentToNote,
  getAllNotes,
  getSentNotesByUser,
  getReceivedNotesByUser,
};
