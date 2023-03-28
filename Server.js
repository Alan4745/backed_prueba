// Importar las variables de entorno del archivo .env
require('dotenv').config();

// Asignación del puerto de comunicación que se encuentra en el archivo .env
const port = process.env.PORT || 4000;

// Importación del módulo http
const http = require('http');

// Importación de la clase Server de socket.io
const { Server } = require('socket.io');

// Importar el servidor creado con express
const app = require('./app');

// Importar la función de conexión a la base de datos
const connectDB = require('./configs/DataBase');

// Importar las funciones de socket.io
const socketFunctions = require('./configs/socket');

// Crear el servidor http con express
const server = http.createServer(app);

// Crear una instancia de la clase Server de socket.io y se configura la cors
const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	}
});

// Inicializar las funciones de socket.io
socketFunctions(io);

// Conectar a la base de datos y una vez conectado, se levanta el servidor
connectDB()
	.then(() => {
		console.log('La Base De Datos esta conectada');
		// Levantar el servidor
		server.listen(port, () => {
			console.log(`El Servidor es coriendo en el: ${port}`);
		});
	})
	.catch((error) => {
		// En caso de error, se muestra un mensaje de error en la consola
		console.error('MongoDB connection error:', error);
	});
