const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://re-social.firebaseapp.com',
  },
});

let users = [];

const addUser = (userId, socketId) => {
  // eslint-disable-next-line no-unused-expressions
  !users.some((user) => user.userId === userId)
    && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => users.find((user) => user.userId === userId);

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
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
    console.log('a user Discinnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

mongoose.set('strictQuery', false);

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_DESARROLLO,
  { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => {
  console.log('Se ha conectado correctamente a la base de datos.');

  server.listen(port, () => {
    console.log('Servidor de Express corriendo correctamente en el puerto', port);
  });
}).catch((error) => console.log(error));
