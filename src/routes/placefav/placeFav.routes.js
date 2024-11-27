const express = require("express");
const md_autenticacion = require("../../middlewares/authentication.js");
const {
  getAllPlacesFav,
  createNewPlaceFav,
  getSentPlacesFavByUser,
  getReceivedPlacesFavByUser,
  getReceivedPlacesByUser,
} = require("../../controllers/placeFav/placeFav.controller.js");

const api = express.Router();

// Rutas de notas
api.get("/getAllPlaces", [md_autenticacion.Auth], getAllPlacesFav);
api.get(
  "/getSentPlacesFavByUser/:userId",
  [md_autenticacion.Auth],
  getSentPlacesFavByUser
);
api.get(
  "/getReceivedPlacesFavByUser/:userId",
  [md_autenticacion.Auth],
  getReceivedPlacesFavByUser
);
api.post("/createNewPlaceFav", [md_autenticacion.Auth], createNewPlaceFav);

module.exports = api;
