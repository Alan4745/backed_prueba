

// CONEXION PUNTO A PUNTO
// LO IMPORTANTE PARA CREAR EL SERVIDOR CON CONEXION A LA BASE DE DATOS

const mongoose = require('mongoose'); //importacion de la libreria mongoose
require('dotenv').config(); //Importancion De Las variables de Entorno

const port = process.env.PORT || 4000; //Asignacion del Puerto de Comunicacion
const http = require('http'); // nos permite peticiones http 'esto es de socket.io'
const { Server } = require('socket.io'); // Permite la conexione en tiempo real con el cliete y servidor
const app = require('./app'); // importar el servidor que crear exprees en el archivo "App.js"

const server = http.createServer(app); // se crear el servidor HTTP con experss


//-----------------Funciones del Chat En Vivo "inicio" 'socket.io'-----------------------------//
 
// aqui levantamos la conexión para poder usar el socke 'socket.io'
const io = new Server(server, {
	//permitir la conexiones de otros dominios
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
});

let users = []; // se almacenara las conexiones de los usuarios para poder usar el chat 'socket.io'
let rooms = []; // se almacenara las conexiones de los canales para poder el chatGrupal 'socket.io'

// funcion para poder agregar el 'el id del usuario' y el 'id del socket' a el array 'User'
const addUser = (userId, socketId) => {
	// verificacion de que si el usuario ya esta dentro de array
	!users.some((user) => user.userId === userId) && // si el usuario esta dentro del array devuelve 'true'
    users.push({ userId, socketId }); // si la validacion anterior es 'true' insertara al usuario al array "USERS"
};

// funcion para poder eliminar el usuario del array "USERS" 'socket.io'
const removeUser = (socketId) => {
	//usamos la funcion "filter" que nos devuelve un array nuevo eliminado el 'id del usuario' y el 'id del socket' 
	users = users.filter((user) => user.socketId !== socketId);
};

// funcion para poder agregar el 'id del socket' del canal al array "ROOMS"
const addUserRoom = (socketId, userName, roomName) => {
	!rooms.some((room) => room.userName === userName) &&
    rooms.push({ socketId, userName, roomName });
};

// funcion para poder eliminar el canal del array "ROOMS" 'socket.io'
const removeUserRoom = (socketId) => {
	rooms = rooms.filter((room) => room.socketId !== socketId);
};

// obtenemos los datos del array "USERS"
const getUser = (userId) => users.find((user) => user.userId === userId);
// obtenemos los datos del array "ROOMS"
const getRoom = (socketId) => rooms.find((room) => room.socketId === socketId);

// iniciamos la conexion del servidor al cliente en tiempo real
io.on('connection', (socket) => {
	console.log('connected to socket.io');

	// -----Inicio----- Al momento de que usuario se conecta al servidor se activa el evento "addUser()" 
	//socket.on es cuando esta esperando un evnto 
	//socket.emit es cuando creamos un evento
	socket.on('addUser', (userId) => {
		// iniciamos la funcion de agregar el usuario en al array "USERS"
		addUser(userId, socket.id);
		//creamos el evento "getUsers"
		io.emit('getUsers', users);
		console.log(users);
	});

	//----FIN----

	// ---Inicio---- al momento de que se conecta a un canal se activa la funcion "addUserRoom()"
	//socket.on es cuando esta esperando un evnto 
	//socket.emit es cuando creamos un evento
	socket.on('joinRoom', ({ userName, roomName }) => {
		//iniciamos la funcion "addUserRoom" para podre agregar el nombre del canal al array "ROOMS"
		addUserRoom(socket.id, userName, roomName);
		//obtenemos los canales para verificar el nombre del canal para poder unirse a la chats
		const room = getRoom(socket.id);
		console.log(rooms);

		//socket.join nos permite concetarnos a un socket existente solo pasando el 'nombre del canal' o del 'socket id'
		socket.join(room.roomName);
		//socket.broadcast es para trasmiter un evento al canal que esta activo mediante su nombre
		socket.broadcast
			.to(room.roomName)
			.emit('message', `${room.userName} has joined the chat`);
	});
	//----FIN----

	//----INICIO---- de la evento "PING PONG"
	socket.on('ping', () => {
		socket.emit('pong');
	});
	//----FIN----

	//----INICIO---- evento de enviar mensajes del canal
	socket.on('sendMessageChannel', ({ senderId, text }) => {
		//verificamos el canales para encotrar el nombre del canal
		const room = getRoom(socket.id);

		//io.to es a donde va dirigido el mensaje 
		// retornams los datos del mensaje
		io.to(room.roomName).emit('messageChannel', {
			senderId,
			text,
			roomName: room.roomName,
			name: room.userName
		});
	});
	//----FIN----

	//----INICIO---- evento de enviar mensajes Privados
	socket.on('sendMessage', ({ senderId, recieverId, text }) => {
		//buscamos en el array "USERS" el socket a quie le vamos a mandar el mensaje
		const user = getUser(recieverId);
		//verificamos que si el usuario esta conectado o no
		if (!user) {
			// el usuario esta desconetado 
			console.log('el usuario no esta conectada');
		} else {
			//enviamos el mensaje al socket del usuario
			io.to(user.socketId).emit('getMessage', {
				senderId,
				text,
				recieverId
			});
		}
	});
	//----FIN----


	//---- INICIO ---- evento de desconectar el socket 
	socket.on('disconnect', () => {
		// buscamos el socket del canal para poderlos desconectar del servidor
		const room = getRoom(socket.id);
		// si es un usuario usara esta funcion para desconetar al uusario del servidor
		removeUser(socket.id);
		// verificamos si el canal esta activo aun 
		if (room) {
			//emitimos el evento al canal para decir que un usuario salio del chat del canal
			io.to(room.roomName).emit(
				'message',
				`${room.userName} has left the chat`
			);
		}

		console.log(`a user Discinnected!${socket.id}`);
		//aqui removemos el socket del canal si que esta activo
		removeUserRoom(socket.id);
		//verificamos si hay aun usuario
		io.emit('getUsers', users);
		console.log(users);
		console.log(rooms);

		//aclaracion aun falta mucho validaciones para ahorrar recursos del servidor
		//el chat se puede trabajar como un servicio aparte para poder solo el servidor principal de la app libre de cargas inicesarias
	});
});

//-----------------"Fin" de La funciones del Chat en vivo-----------------------------//

// permite que las consultas más flexibles 
mongoose.set('strictQuery', false);

//configuracion de mongoose para aceptar promesas asicronas
mongoose.Promise = global.Promise;

//aqui realizamos la conexion a la base de datos de monngose
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('Se ha conectado correctamente a la base de datos.');
		//si se logro conectar a la base de datos iniciara el servidor
		//"server.listen" es que levanta el servidor
		server.listen(port, () => {
			console.log(
				'Servidor de Express corriendo correctamente en el puerto',
				port
			);
		});
	})
	.catch((error) => console.log(error));
