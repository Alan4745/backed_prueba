const {
  ticketsDetectByKmRadius,
} = require("../src/controllers/tickets/ticketsDetectByKmRadius.controller");
const {
  eventsDetectByKmRadius,
} = require("../src/controllers/Events/eventsDetectByKmRadius.controller");
const User = require("../src/models/user.model");
const { calculateDistance } = require("./funcs/calculateDistance");
const { isInsideCircle } = require("./funcs/isInsideCircle");

let users = [
  // {
  //   userId: "6621682d71dc32da1a4b3ac0",
  //   socketId: "6621682d71dc32da1a4b3ac0",
  //   name: "pablo",
  //   imageAvatar: {
  //     public_id: "123",
  //     secure_url:
  //       "https://res.cloudinary.com/dbcusl09w/image/upload/v1714771196/replit/caj4ugqxmkeoeekentzt.png",
  //   },
  //   location: { latitude: 6.275771445599183, longitude: -75.53383296131432 },
  // },
  {
    userId: "66febce4aeefefae9648747d",
    socketId: "66febce4aeefefae9648747d",
    name: "spiterman",
    imageAvatar: {
      public_id: "replit/wakulzv3arbnfvfarnlo",
      secure_url:
        "https://res.cloudinary.com/dbcusl09w/image/upload/v1727970611/replit/wakulzv3arbnfvfarnlo.jpg",
    },
    location: { latitude: 14.6933879, longitude: -90.4786446 },
  },
  {
    userId: "672916398184e16a0455ec1e",
    socketId: "672916398184e16a0455ec1e",
    name: "Gohan",
    imageAvatar: {
      public_id: "replit/d61uahrtfgtzfareysbo",
      secure_url:
        "https://res.cloudinary.com/dbcusl09w/image/upload/v1730746137/replit/d61uahrtfgtzfareysbo.jpg",
    },
    location: { latitude: 10.289637, longitude: -68.021047 },
  },
  {
    userId: "672913008184e16a0455ebe4",
    socketId: "672913008184e16a0455ebe4",
    name: "Vegeta",
    imageAvatar: {
      public_id: "replit/n1he8aa7xlumt7gktwpq",
      secure_url:
        "https://res.cloudinary.com/dbcusl09w/image/upload/v1730745155/replit/n1he8aa7xlumt7gktwpq.jpg",
    },
    location: { latitude: 10.29215, longitude: -68.029242 },
  },
];
let rooms = [];

const addUser = (userId, socketId, user) => {
  !users.some((user) => user.userId === userId) &&
    users.push({
      userId,
      socketId,
      name: user.name,
      imageAvatar: user.imageAvatar,
      location: null,
    });
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
  return users.find((user) => user.userId === userId);
};

const getRoom = (socketId) => rooms.find((room) => room.socketId === socketId);

const socketFunctions = (io) => {
  // iniciamos la conexion del servidor al cliente en tiempo real
  io.on("connection", (socket) => {
    console.log("connected to socket.io");
    console.log("", socket.id);

    // -----Inicio----- Al momento de que usuario se conecta al servidor se activa el evento "addUser()"
    //socket.on es cuando esta esperando un evnto
    //socket.emit es cuando creamos un evento
    socket.on("addUser", (userId, user) => {
      console.log("Adding user:", userId, "with socket ID:", socket.id);
      addUser(userId, socket.id, user);
      io.emit("getUsers", users);
      // console.log('Updated users list:', users);
    });

    //----FIN----
    socket.on("updateLocation", (userId, location) => {
      const userIndex = users.findIndex((user) => user.userId === userId);
      // console.log('users: ', users.length);
      // console.log('userIndex: ', userIndex);
      if (userIndex >= 0) {
        users[userIndex].location = location;

        // Calculamos la distancia entre userIndex y otros usuarios
        const referenceCoords = [location.latitude, location.longitude];
        const nearbyUsers = users.filter((user) => {
          if (user.location && user.userId !== userId) {
            const userCoords = [
              user.location.latitude,
              user.location.longitude,
            ];
            const distance = calculateDistance(referenceCoords, userCoords);
            return distance <= 50000; // 50 km en metros
          }
          return false;
        });
        // console.log('nearby-users: ', nearbyUsers)
        const simplifiedNearbyUsers = nearbyUsers.map((user) => ({
          idUser: user.userId,
          name: user.name,
          imageAvatar: user.imageAvatar,
          location: user.location,
        }));

        // Emitimos solo los usuarios cercanos
        // console.log('simple-if', simplifiedNearbyUsers.length)
        io.emit("getNearbyUsers", simplifiedNearbyUsers); // Emitir a todos los clientes
      }

      // Emitimos todos los usuarios como antes
      const referenceCoords = [location.latitude, location.longitude];
      const nearbyUsers = users.filter((user) => {
        if (user.location && user.userId !== userId) {
          const userCoords = [user.location.latitude, user.location.longitude];
          const distance = calculateDistance(referenceCoords, userCoords);
          return distance <= 50000; // 50 km en metros
        }
        return false;
      });
      // console.log('nearby-users: ', nearbyUsers)
      // Incluimos al usuario que actualizó su ubicación en la lista de usuarios cercanos
      const simplifiedNearbyUsers = [
        !users[userIndex]
          ? nearbyUsers.map((user) => ({
              idUser: user.userId,
              name: user.name,
              imageAvatar: user.imageAvatar,
              location: user.location,
            }))
          : {
              idUser: users[userIndex].userId,
              name: users[userIndex].name,
              imageAvatar: users[userIndex].imageAvatar,
              location: users[userIndex].location,
            },
        ...nearbyUsers.map((user) => ({
          idUser: user.userId,
          name: user.name,
          imageAvatar: user.imageAvatar,
          location: user.location,
        })),
      ];

      // console.log('simple: ', simplifiedNearbyUsers.length)
      io.emit("getUsers", simplifiedNearbyUsers);
    });
    //--Inicio---
    socket.on("usersNearbyLocation", (userId, location) => {
      const userIndex = users.findIndex((user) => user.userId === userId);

      if (userIndex >= 0) {
        users[userIndex].location = location;
        const referenceCoords = [location.latitude, location.longitude];

        // Calcular usuarios cercanos dentro de 1.5 km
        const nearbyUsers = users.filter((user) => {
          if (user.location && user.userId !== userId) {
            const userCoords = [
              user.location.latitude,
              user.location.longitude,
            ];
            const distance = calculateDistance(referenceCoords, userCoords);
            return distance <= 1500; // 1.5 km en metros
          }
          return false;
        });

        // Notificar al usuario actual
        const numberOfNearbyUsers = nearbyUsers.length;
        if (numberOfNearbyUsers >= 1) {
          io.to(users[userIndex].socketId).emit(
            "nearbyUsersMessage",
            `Tienes ${numberOfNearbyUsers} usuarios cerca de ti, en un radio de 1.5 km`
          );
        } else {
          io.to(users[userIndex].socketId).emit(
            "nearbyUsersMessage",
            `No Tienes ningun usuario cercano a tu ubicacion.`
          );
        }
      }
    });
    //--Fin---

    // ---Inicio---- al momento de que se conecta a un canal s1e activa la funcion "addUserRoom()"
    //socket.on es cuando esta esperando un evnto
    //socket.emit es cuando creamos un evento
    socket.on("joinRoom", ({ userName, roomName }) => {
      // Iniciamos la función "addUserRoom" para agregar el nombre del canal al array "ROOMS"
      addUserRoom(socket.id, userName, roomName);

      // Verificamos si la sala ha sido correctamente agregada
      const room = getRoom(socket.id);

      if (room && room.roomName) {
        // socket.broadcast es para transmitir un evento al canal que está activo mediante su nombre
        socket.broadcast
          .to(room.roomName)
          .emit("message", `${room.userName} has joined the chat`);
      } else {
        console.error(`Room not found for socket id: ${socket.id}`);
      }
    });

    // Funcion para detectar usuarios a tiempo real adentro de un evento
    // -- Inicio -- //
    socket.on("detectEventsInRadius", async (data, callback) => {
      try {
        const { coordinates, user } = data;

        // Log inicial para inspeccionar la entrada de datos
        console.log("Evento detectado: detectEventsInRadius");
        console.log("Datos recibidos:", data);

        // Valida que las coordenadas estén presentes
        if (!coordinates || coordinates.length !== 2) {
          console.error("Coordenadas inválidas:", coordinates);
          return callback({
            success: false,
            message: "Coordenadas inválidas. Se esperan [latitud, longitud].",
          });
        }

        // Llama al controlador `eventsDetectByKmRadius`
        const req = { body: { coordinates } }; // Simula el request
        const res = {
          status: (statusCode) => ({
            json: (response) => ({ statusCode, ...response }),
          }),
        };

        const result = await eventsDetectByKmRadius(req, res);

        // Log para inspeccionar el resultado del controlador
        console.log("Resultados de eventsDetectByKmRadius:", result);

        if (result.success) {
          const filteredEvents = result.eventsFound.map((event) => {
            // Inicializa `usersInside` si no existe
            event.usersInside = event.usersInside || [];

            console.log(`Procesando evento: ${event.name}`);
            console.log("Usuarios iniciales dentro del evento:", event.usersInside);

            const isInside = isInsideCircle(coordinates, event.coordinates, event.radio);

            console.log("El usuario está dentro del radio:", isInside);

            if (isInside) {
              // Agrega el usuario actual a `usersInside`, evitando duplicados
              event.usersInside = [
                ...new Map(
                  [...event.usersInside, { userId: user._id, imageAvatar: user.imageAvatar, name: user.name }]
                    .map((u) => [u.userId, u]) // Evita duplicados usando userId como clave
                ).values(),
              ];

              console.log("Usuarios actualizados dentro del evento:", event.usersInside);

              // Simula la actualización de la base de datos (si corresponde)
              // await updateEventUsersInside(event._id, event.usersInside);
            }

            // Devuelve el evento con los usuarios actualizados
            return {
              ...event,
              usersInside: event.usersInside,
              usersCount: event.usersInside.length,
            };
          });

          console.log("Eventos procesados con usuarios actualizados:", filteredEvents);

          // Responde con los eventos filtrados
          callback({ success: true, events: filteredEvents });
        } else {
          console.error("Error en eventsDetectByKmRadius:", result.message);
          callback({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Error detectando eventos:", error);
        callback({
          success: false,
          message: "Ocurrió un error al procesar la solicitud.",
        });
      }
    });

    // -- Fin -- //

    // Evento para detectar tickets dentro de un radio
    // -- Inicio -- //
    socket.on("detectTicketsInRadius", async (data, callback) => {
      try {
        const { coordinates } = data;

        // Valida que las coordenadas estén presentes
        if (!coordinates || coordinates.length !== 2) {
          return callback({
            success: false,
            message: "Coordenadas inválidas. Se esperan [latitud, longitud].",
          });
        }

        // Llama al controlador `ticketsDetectByKmRadius`
        const req = { body: { coordinates } }; // Simula el request
        const res = {
          status: (statusCode) => ({
            json: (response) => ({ statusCode, ...response }),
          }),
        };

        const result = await ticketsDetectByKmRadius(req, res);
        console.log("result-tickets: ", result.success);
        // Verifica el resultado y responde al cliente
        if (result.success) {
          callback({ success: true, tickets: result.ticketsFound });
        } else {
          callback({ success: false, message: result.message });
        }
      } catch (error) {
        console.error("Error detecting tickets:", error);
        callback({
          success: false,
          message: "Ocurrió un error al procesar la solicitud.",
        });
      }
    });

    socket.on("ticketCanal", (roomName) => {
      console.log(`Cliente se ha unido a la habitación ${roomName}`);
    });

    socket.on("ticketCanalEvent", (roomName, message) => {
      io.to(roomName).emit("checkTicket", message); // Se envía el mensaje a la habitación especificada
    });
    //----FIN----

    //----INICIO---- de la evento "PING PONG"
    socket.on("ping", (message) => {
      console.log("Mensaje recibido:", message);
      // Devolver el mismo mensaje al cliente con 'ping' y 'pong' concatenados
      const responseMessage = "pong";
      socket.emit("pong", responseMessage);
    });

    //----FIN----

    //----INICIO---- evento de enviar mensajes del canal
    socket.on("sendMessageChannel", ({ senderId, text }) => {
      //verificamos el canales para encotrar el nombre del canal
      const room = getRoom(socket.id);

      //io.to es a donde va dirigido el mensaje
      // retornams los datos del mensaje
      io.to(room.roomName).emit("messageChannel", {
        senderId,
        text,
        roomName: room.roomName,
        name: room.userName,
      });
    });
    //----FIN----

    //----INICIO---- evento de enviar mensajes Privados
    socket.on(
      "sendNote",
      ({ senderId, receiverId, text, imageAvatar, username }) => {
        console.log("Sender ID:", senderId);
        console.log("Receiver ID:", receiverId);

        // Buscamos al usuario receptor
        const user = getUser(receiverId);

        if (!user) {
          // El usuario está desconectado
          console.log("El usuario no está conectado");
        } else {
          // Enviamos el mensaje al socket del usuario receptor
          io.to(user.socketId).emit("getNote", {
            senderId,
            text,
            receiverId,
            imageAvatar,
            username,
          });
          console.log("Nota enviado a", receiverId);
        }
      }
    );

    //----FIN----
    //----INICIO---- evento de enviar mensajes Privados
    socket.on(
      "sendMessage",
      ({ senderId, receiverId, text, imageAvatar, username }) => {
        console.log("Sender ID:", senderId);
        console.log("Receiver ID:", receiverId);

        // Buscamos al usuario receptor
        const user = getUser(receiverId);

        if (!user) {
          // El usuario está desconectado
          console.log("El usuario no está conectado");
        } else {
          // Enviamos el mensaje al socket del usuario receptor
          io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
            receiverId,
            imageAvatar,
            username,
          });
          console.log("Mensaje enviado a", receiverId);
        }
      }
    );

    //----FIN----

    //---- INICIO ---- evento de desconectar el socket
    socket.on("disconnect", () => {
      // buscamos el socket del canal para poderlos desconectar del servidor
      const room = getRoom(socket.id);
      // si es un usuario usara esta funcion para desconetar al uusario del servidor
      removeUser(socket.id);
      // verificamos si el canal esta activo aun
      if (room) {
        //emitimos el evento al canal para decir que un usuario salio del chat del canal
        io.to(room.roomName).emit(
          "message",
          `${room.userName} has left the chat`
        );
      }

      console.log(`a user Discinnected!${socket.id}`);
      //aqui removemos el socket del canal si que esta activo
      removeUserRoom(socket.id);
      //verificamos si hay aun usuario
      io.emit("getUsers", users);
      console.log(users);
      console.log(rooms);

      //aclaracion aun falta mucho validaciones para ahorrar recursos del servi dor
      //el chat se puede trabajar como un servicio aparte para poder solo el servidor principal de la app libre de cargas inicesarias
    });
  });

  //-----------------"Fin" de La funciones del Chat en vivo-----------------------------//
};

module.exports = socketFunctions;
