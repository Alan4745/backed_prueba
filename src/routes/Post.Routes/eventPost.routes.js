
const express = require('express');
const controllerEventPost= require('../../controllers/post/eventPost.controller');
const controllerAuth = require('../../middlewares/authentication');

const api = express.Router();


api.post('/createEventPost/:idCommunity', [controllerAuth.Auth], controllerEventPost.createPostEvent);

api.get('/postEventRecent/:idCommunity', [controllerAuth.Auth], controllerEventPost.findEventRecent);



module.exports = api;
