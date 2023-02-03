/* eslint-disable linebreak-style */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const app = express();

// IMPORTACION DE RUTAS
const userRouter = require('./src/routes/user.routes');
const messageRouter = require('./src/routes/message.routes');
const conversationRouter = require('./src/routes/Conversation.routes');
// const postRouter = require('./src/routes/postRoute/Post.routes');
const communityRouter = require('./src/routes/community.routes');
const channelRouter = require('./src/routes/channel.routes');
const messageChannelRouter = require('./src/routes/messageChannel.routes');
const tokenRouter = require('./src/routes/token.routes');
const postTypeARouter = require('./src/routes/postRoute/postTypeA.routes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CABECERAS
app.use(cors());
app.use(morgan('dev'));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}));

// CARGA DE RUTAS localHost:4000/api/productos
app.use(
  '/api',
  userRouter,
  messageRouter,
  conversationRouter,
  // postRouter,
  postTypeARouter,
  communityRouter,
  channelRouter,
  messageChannelRouter,
  tokenRouter
);

module.exports = app;
