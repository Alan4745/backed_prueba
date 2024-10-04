let users = [];
let rooms = [];


const addUser = (userId, socketId) => {
	!users.some((user) => user.userId === userId) &&
		users.push({ userId, socketId });
};

const removeUser = (socketId) => {
	users = users.filter((user) => user.socketId !== socketId);
};

const addUserRoom = (socketId, userName, roomName) => {
	!rooms.some((room) => room.userName === userName) &&
		rooms.push({ socketId, userName, roomName });
};

const removeUserRoom = (socketId) => {
	rooms = rooms.filter((room) => room.socketId !== socketId);
};

// eslint-disable-next-line no-unused-vars
const getUser = (userId) => {
	return users.find(user => user.userId === userId);
};

const getRoom = (socketId) => rooms.find((room) => room.socketId === socketId);

const socketFunctions = (io) => {
	// iniciamos la conexion del servidor al cliente en tiempo real
	io.on('connection', (socket) => {
		console.log('connected to socket.io');
		console.log(socket.id);


		// -----Inicio----- Al momento de que usuario se conecta al servidor se activa el evento "addUser()"
		//socket.on es cuando esta esperando un evnto
		//socket.emit es cuando creamos un evento
		socket.on('addUser', (userId) => {
			console.log('Adding user:', userId, 'with socket ID:', socket.id);
			addUser(userId, socket.id);
			io.emit('getUsers', users);
			console.log('Updated users list:', users);
		});

		//----FIN----

		// ---Inicio---- al momento de que se conecta a un canal se activa la funcion "addUserRoom()"
		//socket.on es cuando esta esperando un evnto
		//socket.emit es cuando creamos un evento
		socket.on('joinRoom', ({ userName, roomName }) => {
			// Iniciamos la función "addUserRoom" para agregar el nombre del canal al array "ROOMS"
			addUserRoom(socket.id, userName, roomName);

			// Verificamos si la sala ha sido correctamente agregada
			const room = getRoom(socket.id);


			if (room && room.roomName) {
				// socket.broadcast es para transmitir un evento al canal que está activo mediante su nombre
				socket.broadcast
					.to(room.roomName)
					.emit('message', `${room.userName} has joined the chat`);
			} else {
				console.error(`Room not found for socket id: ${socket.id}`);
			}
		});


		socket.on('ticketCanal', (roomName) => {
			console.log(`Cliente se ha unido a la habitación ${roomName}`);
		});


		socket.on('ticketCanalEvent', (roomName, message) => {
			io.to(roomName).emit('checkTicket', message); // Se envía el mensaje a la habitación especificada
		});
		//----FIN----

		//----INICIO---- de la evento "PING PONG"
		socket.on('ping', (message) => {
			console.log('Mensaje recibido:', message);
			// Devolver el mismo mensaje al cliente con 'ping' y 'pong' concatenados
			const responseMessage = 'pong';
			socket.emit('pong', responseMessage);
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
				name: room.userName,
			});
		});
		//----FIN----

		//----INICIO---- evento de enviar mensajes Privados
		socket.on('sendMessage', ({ senderId, receiverId, text, imageAvatar, username }) => {
			console.log('Sender ID:', senderId);
			console.log('Receiver ID:', receiverId);

			// Buscamos al usuario receptor
			const user = getUser(receiverId);

			if (!user) {
				// El usuario está desconectado
				console.log('El usuario no está conectado');
			} else {
				// Enviamos el mensaje al socket del usuario receptor
				io.to(user.socketId).emit('getMessage', {
					senderId,
					text,
					receiverId,
					imageAvatar,
					username
				});
				console.log('Mensaje enviado a', receiverId);
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

			//aclaracion aun falta mucho validaciones para ahorrar recursos del servi dor
			//el chat se puede trabajar como un servicio aparte para poder solo el servidor principal de la app libre de cargas inicesarias
		});
	});

	//-----------------"Fin" de La funciones del Chat en vivo-----------------------------//
};

module.exports = socketFunctions;
