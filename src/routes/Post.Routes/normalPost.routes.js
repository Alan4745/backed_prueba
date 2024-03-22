
const express = require('express');
const controllerNormalPost= require('../../controllers/post/normalPost.controlle');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();


api.post('/createNormalPost/:idCommunity', [controllerAuth.Auth], controllerNormalPost.createPostNormal);


module.exports = api;
