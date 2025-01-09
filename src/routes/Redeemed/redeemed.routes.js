const express = require("express");
const { TicketsAndPointsByUserRedeemed } = require("../../controllers/SearchRedeemed/TicketsAndPointsByUserRedeemed.controller")

const api = express.Router();

api.get('/getTicketsAndPointsByUserRedeemed/:userId', TicketsAndPointsByUserRedeemed
);
module.exports = api;
