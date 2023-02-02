/* eslint-disable no-unused-expressions */
const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;
const http = require('http');
const { Server } = require('socket.io');
const { MONGODB_URI } = require('./config');

const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

let users = [];
let rooms = [];

const addUser = (userId, socketId) => {
  // eslint-disable-next-line no-unused-expressions
  !users.some((user) => user.userId === userId)
    && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const addUserRoom = (socketId, userName, roomName) => {
  !rooms.some((room) => room.userName === userName)
    && rooms.push({ socketId, userName, roomName });
};

const removeUserRoom = (socketId) => {
  // eslint-disable-next-line no-const-assign
  rooms = rooms.filter((room) => room.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);
const getRoom = (socketId) => rooms.find((room) => room.socketId === socketId);
const botName = 'ChatCord Bot';

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
    console.log(users);
  });

  socket.on('joinRoom', ({ userName, roomName }) => {
    addUserRoom(socket.id, userName, roomName);
    const room = getRoom(socket.id);
    console.log(rooms);

    socket.join(room.roomName);

    socket.emit('message', `${botName} Welcome al chat`);

    socket.broadcast
      .to(room.roomName).emit('message', `${room.userName} has joined the chat`);
  });

  socket.on('ping', () => {
    socket.emit('pong');
  });

  socket.on('sendMessageChannel', ({ senderId, text }) => {
    const room = getRoom(socket.id);

    io.to(room.roomName).emit('messageChannel', {
      senderId,
      text,
      roomName: room.roomName,
      name: room.userName,
    });
  });

  // send and get message
  socket.on('sendMessage', ({ senderId, recieverId, text }) => {
    const user = getUser(recieverId);
    if (!user) {
      console.log('el usuario no esta conectada');
    } else {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        recieverId,
      });
    }
  });

  socket.on('disconnect', () => {
    const room = getRoom(socket.id);
    removeUser(socket.id);
    if (room) {
      io.to(room.roomName).emit('message', `${room.userName} has left the chat`);
    }

    console.log(`a user Discinnected!${socket.id}`);
    removeUserRoom(socket.id);
    io.emit('getUsers', users);
    console.log(users);
    console.log(rooms);
  });
});

mongoose.set('strictQuery', false);

mongoose.Promise = global.Promise;
mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => {
  console.log('Se ha conectado correctamente a la base de datos.');

  server.listen(port, () => {
    console.log('Servidor de Express corriendo correctamente en el puerto', port);
  });
}).catch((error) => console.log(error));
