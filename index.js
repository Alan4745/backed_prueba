//CONEXION PUNTO A PUNTO 
//LO IMPORTANTE PARA CREAR EL SERVIDOR CON CONEXION A LA BASE DE DATOS

const mongoose = require('mongoose');
require('dotenv').config();

const port = process.env.PORT || 4000;
const http = require('http');
const { Server } = require('socket.io'); // chat socket conexion para chat 
const app = require('./app');  // importar el servidor

const server = http.createServer(app); // mandar a llamar el servidor de expreess
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});
//////////////////////

/////////// Crear funciones para LA BASE DATOS ////////////////////////////////////////////

let users = []; //cuando se conecta un usuario al server se guarda aqui 

const addUser = (userId, socketId) =>  {    // funcion en flecha creando un usuario   
  // eslint-disable-next-line no-unused-expressions
  !users.some((user) => user.userId === userId)//CONDICIONALES PARA AÑADIR A LA BASE DE DATOS USUARIOS
&& users.push({ userId, socketId });  //CONDICIONALES PARA AÑADIR A LA BASE DE DATOS USUARIOS
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
    console.log(users);
  });

  socket.on('ping', () => {
    socket.emit('pong');
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
    console.log(`a user Discinnected!${socket.id}`);
    removeUser(socket.id);
    io.emit('getUsers', users);
    console.log(users);
  });
});

mongoose.set('strictQuery', false);

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
).then(() => {
  console.log('Se ha conectado correctamente a la base de datos.');

  server.listen(port, () => {
    console.log('Servidor de Express corriendo correctamente en el puerto', port);
  });
}).catch((error) => console.log(error));
