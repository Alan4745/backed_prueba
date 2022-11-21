const express = require('express');
const cors = require('cors');
const app = express();

const userRouter = require ('./src/routes/user.routes.js')


// IMPORTACION DE RUTAS



// MIDDLEWARES
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localHost:3000/api/productos
app.use('/api', userRouter);

module.exports = app;