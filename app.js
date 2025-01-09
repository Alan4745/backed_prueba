// Importar los paquetes necesarios
const express = require("express"); // Framework para construir aplicaciones web
const morgan = require("morgan"); //Middleware que registra los detalles de las solicitudes HTTP
const cors = require("cors"); // Middleware que ayuda a configurar la politica de mismo origen en la aplicacion
const fileUpload = require("express-fileupload"); // Middleware que permite gestionar la carga de archivos en el servidor

// Crea la instancia de la aplicacion Express
const app = express();

// ---INICIO---- Importar las rutas que se utilizaran en la aplicacion
const userRouter = require("./src/routes/user.routes");
const messageRouter = require("./src/routes/message.routes");
const conversationRouter = require("./src/routes/Conversation.routes");
const postRouter = require("./src/routes/Post.Routes/post.routes");
const channelRouter = require("./src/routes/channel.routes");
const messageChannelRouter = require("./src/routes/messageChannel.routes");
const tokenRouter = require("./src/routes/token.routes");
const paymentRouter = require("./src/routes/payment/payment.routes");
const pointsRouter = require("./src/routes/points/points.routes");
const redeemedRoutes = require("./src/routes/Redeemed/redeemed.routes");
const ticketsRouter = require("./src/routes/tickets/ticket.routes");
const notificationRouter = require("./src/routes/notification/notification.routes");
const follow = require("./src/routes/follow/follow.routes");
const note = require("./src/routes/note/note.routes");
const event = require("./src/routes/Events/events.router");
const place = require("./src/routes/placefav/placeFav.routes");


const checkout = require("./src/routes/checkout.routes");
const passport = require("passport");
const session = require("express-session");
// const postTypeARouter = require('./src/routes/postRoute/postTypeA.routes');
//---FIN----

// // POST NORMAL
// const NormalPostRouter = require('./src/routes/Post.Routes/normalPost.routes');
// // POST event
// const EventPostRouter = require('./src/routes/Post.Routes/eventPost.routes');

// Configura los middlewares de la aplicacion
app.use(express.urlencoded({ extended: false })); // Middleware que analiza los datos de la solicitud HTTP y los pone en un objeto req.body
app.use(express.json()); // Middleware que analiza los datos de la solicitud HTTP en formato JSON y los pone en un objeto req.body

app.use(cors()); //Middleware que permiten el acceso a la API desde cualquier origen
app.use(morgan("dev")); // morgan nos muestra en consola que peticiones estan entrantes a la API
app.use(
  fileUpload({
    useTempFiles: true, // Usa archivos temporales para gestionar la carga de archivos
    tempFileDir: "./uploads", // directorio donde se almacenara los archivos temporales
  })
);

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

app.use(passport.initialize());

app.use(passport.session());

// Configurar las rutas de la aplicacion
app.use(
  "/api", // Prefijo que se añadira a todas las rutas
  userRouter, // rutas para Usuarios
  messageRouter, // Rutas para mensajes
  conversationRouter, // Rutas para conversaciones
  postRouter, //Rutas para publicaciones
  channelRouter, // Rutas para Canales
  messageChannelRouter, // Rutas para mensajes de canal
  // NormalPostRouter, // POST NORMAL
  // EventPostRouter, // event post
  tokenRouter, // Rutas para tokens
  checkout, //ruta de cobro
  paymentRouter, // ruta de pagos (stripe)
  pointsRouter, //rutas de puntos
  ticketsRouter, //rutas de ticket
  notificationRouter, //rutas de notificaciones
  follow, //rutas de seguidores y seguidos
  note, //rutas de notas
  redeemedRoutes, //rutas de canjeados
  place, //rutas de notas
  event //rutas de eventos
);

// Exportamos la instancia de la aplicacion
module.exports = app;
