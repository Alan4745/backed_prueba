let users = [];
let rooms = [];

const addUser = (userId, socketId) => {
    // Busca si el usuario ya existe en el array 'users'
    const existingUser = users.find(user => user.userId === userId);
    
    if (existingUser) {
        // Si el usuario ya existe, actualizamos solo su socketId
        existingUser.socketId = socketId;
    } else {
        // Si el usuario no existe, lo añadimos al array
        users.push({ userId, socketId, location: null });
    }
};

// const addUser = (userId, socketId) => {
//     // Verificamos si el usuario ya existe en el array 'users' basado en 'userId'
// 	const existingUser = users.find(user => user.userId === userId);
// 	if (existingUser) {
// 		// Si el usuario existe, actualizamos su socketId
// 		existingUser.socketId = socketId;
// 	}
//     const existingUserIndex = users.findIndex(user => user.userId === userId);
//     // const existingIdUserIndex = users.findIndex(user => user.idUser === idUser);

//     if (existingUserIndex !== -1) {
//         // Si el usuario ya existe, reemplazamos el antiguo con el nuevo
//         users[existingUserIndex] = { userId, socketId, location: null };
//     } else {
//         // Si no existe, lo añadimos al array
//         users.push({ userId, socketId, location: null });
//     }
// };

const updateUserLocation = (user, location) => {
    users = users.map((item) =>
        item.userId === user._id 
            ? { ...item, location }
            : item
    );
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
		// socket.on('addUser', (userId) => {
		// 	console.log('Adding user:', userId, 'with socket ID:', socket.id);
		// 	addUser(userId, socket.id);
		// 	io.emit('getUsers', users);
		// 	console.log('Updated users list:', users);
		// });
		// Cuando un usuario se conecta y emite el evento 'addUser'
		// socket.on('addUser', (userId, user) => {
		// 	// Verifica si el usuario ya está en la lista para evitar 
		// 	if (users.length === 0 ) {
		// 		users.push({ 
		// 			idUser: userId, 
		// 			socketId: socket.id,
		// 			name: user.name,
		// 			imageAvatar: user.imageAvatar,
		// 			location: null
		// 		})
		// 		console.log(users)
		// 	}
		// 	if (!users.some(user => user.idUser === userId)) {
		// 		// Si el usuario no existe, lo agregamos
		// 		users.push({ 
		// 			idUser: userId, 
		// 			socketId: socket.id,
		// 			name: user.name,
		// 			imageAvatar: user.imageAvatar,
		// 			location: null
		// 		});
		// 		console.log(users)
		// 	} else {
		// 		// El usuario ya existe, puedes hacer algo aquí, como enviar un mensaje
		// 		console.log(`User with ID ${userId} already exists.`);
		// 		// Si deseas emitir algún mensaje a los clientes, puedes hacerlo aquí
		// 		// io.emit('userExists', { userId }); // ejemplo de emisión
		// 	}
		// });

        socket.on("updateLocation", (userId, location) => {
			// updateUserLocation(user, location);
			// users = users.map((item) =>
			// 	item.userId === user._id 
			// 		? { ...item, location }
			// 		: item
			// );
			const  userIndex = users.findIndex((user) => user.idUser == userId);
			if (userIndex >= 0) {
				users[userIndex].location =  location;
				console.log(users)
			}		
			// Emitir solo los campos específicos
			const simplifiedUsers = users.map(user => ({
				idUser: user.idUser,
				name: user.name,
				imageAvatar: user.imageAvatar,
				location: user.location
			}));
		
			io.emit("getUsers", simplifiedUsers); // Emitir a todos los clientes
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

		// Evento para escuchar y transmitir notas
		socket.on('note', ({ senderId, receiverId, noteContent, statusNote }) => {
			const user = getUser(receiverId);
			if (user) {
				io.to(user.socketId).emit('getNote', {
					senderId,
					receiverId,
					noteContent,
					statusNote
				});
				console.log(`Nota enviada de ${senderId} a ${receiverId}: ${noteContent}`);
			} else {
				console.log('El usuario no está conectado para recibir la nota');
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
