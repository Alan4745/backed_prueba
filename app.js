/* eslint-disable linebreak-style */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

// IMPORTACION DE RUTAS
const userRouter = require('./src/routes/user.routes');
const messageRouter = require('./src/routes/message.routes');
const conversationRouter = require('./src/routes/Conversation.routes');
const postRouter = require('./src/routes/Post.routes');
const communityRouter = require('./src/routes/community.routes');
const channelRouter = require('./src/routes/channel.routes');
const messageChannelRouter = require('./src/routes/messageChannel.routes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());
app.use(morgan('dev'));

// CARGA DE RUTAS localHost:3000/api/productos
app.use('/api', userRouter, messageRouter, conversationRouter, postRouter, communityRouter, channelRouter, messageChannelRouter);

module.exports = app;
