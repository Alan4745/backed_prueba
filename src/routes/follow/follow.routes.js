const express = require("express");

// const md_autenticacion = require("../middlewares/authentication");
const { usersFindFollowing } = require("../../controllers/follow/usersFindFollowing.controller.js");
const { usersFindFollower } = require("../../controllers/follow/usersFindFollower.controller.js");

// poder usar la rutas.
const api = express.Router();

// user following
api.get("/userFindFollowing/:userId", usersFindFollowing)
// user follower
api.get("/userFindFollower/:userId", usersFindFollower)

module.exports = api;