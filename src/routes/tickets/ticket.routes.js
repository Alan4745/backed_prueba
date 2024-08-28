const express = require("express");
const {
    createPerimeterTickets, 
    getPerimeterTickets, 
    getPerimeterTicketById, 
    updatePerimeterTicketById,
    deletePerimeterTicketById
} = require("../../controllers/tickets/tickets.controller");
const { 
    getAllTicketsMarked, 
    getTicketMarkedById, 
    createTicketMarked, 
    updateTicketMarkedById, 
    deleteTicketMarkedById 
} = require("../../controllers/tickets/ticketsMarked.controller");
const { 
    getTicketsRedeemed, 
    getTicketsRedeemedById, 
    createTicketsRedeemed, 
    deleteTicketsRedeemedById
} = require("../../controllers/tickets/ticketsReemed.controller");
const { createPerimeterAndDistributeTickets } = require("../../controllers/tickets/ticketsRadomPerimeter.controller");
const api = express.Router();

// Rutas para emitir puntos
api.get('/getPerimeterTickets', getPerimeterTickets)
api.get('/getPerimeterTickets/:id', getPerimeterTicketById)
api.post('/createPerimeterTickets', createPerimeterTickets)
api.post('/createPerimeterAndDistributeTickets', createPerimeterAndDistributeTickets)
api.put('/updatePerimeterTicketById/:id', updatePerimeterTicketById)
api.delete('/deletePerimeterTicketById/:id', deletePerimeterTicketById)
// Rutas para marcar puntos
api.get('/getAllTicketsMarked', getAllTicketsMarked)
api.get('/getMarkedTickets/:id', getTicketMarkedById)
api.post('/createMarkedTickets', createTicketMarked)
api.put('/updateTicketsMarkedById/:id', updateTicketMarkedById)
api.delete('/deleteTicketsMarkedById/:id', deleteTicketMarkedById)
// Rutas para canjear puntos
api.get('/getTicketsRedeemed', getTicketsRedeemed)
api.get('/getTicketsRedeemed/:id', getTicketsRedeemedById)
api.post('/createTicketsRedeemed', createTicketsRedeemed)
api.delete('/deleteTicketsRedeemedById/:id', deleteTicketsRedeemedById)

module.exports = api