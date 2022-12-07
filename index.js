const mongoose = require('mongoose');
const app = require('./app');
require("dotenv").config();
const port = process.env.PORT || 4000;
const http = require('http');
const { Server } = require("socket.io");


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
})


io.on('connection', (socket) => {
    console.log("connected to socket.io");
});


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DESARROLLO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    server.listen(port, function () {
        console.log("Servidor de Express corriendo correctamente en el puerto", port);
    });

}).catch(error => console.log(error));

