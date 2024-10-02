const express = require("express");

// const md_autenticacion = require("../middlewares/authentication");
const md_autenticacion = require("../../middlewares/authentication.js");
const { usersFindFollowing } = require("../../controllers/follow/usersFindFollowing.controller.js");
const { usersFindFollower } = require("../../controllers/follow/usersFindFollower.controller.js");

// poder usar la rutas.
const api = express.Router();

// user following
api.get("/userFindFollowing/:userId", [md_autenticacion.Auth], usersFindFollowing)
// user follower
api.get("/userFindFollower/:userId", [md_autenticacion.Auth], usersFindFollower)

module.exports = api;