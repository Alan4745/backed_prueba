const express = require("express");
const controllerToken = require("../controllers/token.controller");

const md_autenticacion = require("../middlewares/authentication");

// poder usar la rutas.
const api = express.Router();

const cobro_ticket_controller = require("../controllers/tickets/cobrar_ticket");

// metodos Get
api.get("/obtenerToken/:author",[md_autenticacion.Auth],controllerToken.viewToken); 
api.get("/obtenerTokenPorId/:tokenId",[md_autenticacion.Auth],controllerToken.viewTokenById); 
// metodo actualizado 🆗

// metodos Post
api.post("/addTokenToCollection",[md_autenticacion.Auth],controllerToken.addTokenToCollection); 
// metodo actualizado 🆗
api.post("/addTokenToCollectionNew",[md_autenticacion.Auth],controllerToken.addTokenToCollectionNew); 
// metodo actualizado 🆗

api.post("/tokensSolo", [md_autenticacion.Auth], controllerToken.tokensSolos); 
// metodo no actualizado ❌

api.post("/create-collection",[md_autenticacion.Auth],controllerToken.createCollectionWithTickets);

// metodos Put
api.put("/redeemTiceket/:idTicket",[md_autenticacion.Auth],controllerToken.redeemTicket); 
// metodo actualizado 🆗
api.put("/burnTicket/:idTicket",[md_autenticacion.Auth],controllerToken.burnTicket); 
// metodo actualizado 🆗

//burnTicket
// metodos Delete
//Eliminar solo un tikect
api.delete("/deleteOneTicket/:idTicket",[md_autenticacion.Auth],controllerToken.deleteOneTicket); 

//COBRAR TICKET A LAS PERSONAS
api.put("/cobrar/:ticket_id", cobro_ticket_controller.cobrar); 
// metodo actualizado 🆗


// Colecciones
api.get("/getcollections/:name",[md_autenticacion.Auth],controllerToken.findCollectionByName); 
// metodo actualizado 🆗
api.get("/getcollectionsById/:collectionId",[md_autenticacion.Auth],controllerToken.findCollectionById); 
// metodo actualizado 🆗
api.get("/getCollectionsUser",[md_autenticacion.Auth],controllerToken.findCollectionByUser); 
// metodo actualizado 🆗
api.get("/getcollectionsbyidauthor/:authorId",[md_autenticacion.Auth],controllerToken.getCollectionsByAuthorId); 
// metodo actualizado 🆗

api.post("/createCollection",[md_autenticacion.Auth],controllerToken.createCollection); 
// metodo actualizado 🆗

api.put("/updateCollection/:collectionId",[md_autenticacion.Auth],controllerToken.updateCollection); 
// metodo actualizado 🆗



module.exports = api;
