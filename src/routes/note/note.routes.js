const express = require("express");
const md_autenticacion = require("../../middlewares/authentication.js");
const { 
    createNewNote, 
    getAllNotes,  
    getSentNotesByUser, 
    getReceivedNotesByUser 
} = require("../../controllers/note/note.controller.js");

const api = express.Router();

// Rutas de notas
api.get("/getAllNotes", [md_autenticacion.Auth], getAllNotes);
api.get("/getSentNotesByUser/:userId", [md_autenticacion.Auth], getSentNotesByUser);
api.get("/getReceivedNotesByUser/:userId", [md_autenticacion.Auth], getReceivedNotesByUser);
api.post("/createNewNote", [md_autenticacion.Auth], createNewNote);

module.exports = api;
