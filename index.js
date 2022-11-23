const mongoose = require('mongoose');
const app = require('./app');
require("dotenv").config();
const port = process.env.PORT || 4000;


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_DESARROLLO, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Se ha conectado correctamente a la base de datos.');

    app.listen(port, function () {
        console.log("Servidor de Express corriendo correctamente en el puerto", port);
    });

}).catch(error => console.log(error));