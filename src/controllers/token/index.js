const { addTokenToCollection } = require('./addTokenToCollection')
const { addTokenToCollectionNew } = require('./addTokenToCollectionNew')
const { createCollection } = require('./createCollection')
const { updateCollection } = require('./updateCollection')
const { viewToken } = require('./viewToken')
const { getTicketsByColletion } = require('./getTicketsByColletion')
const { viewTokenById } = require('./viewTokenById')
const { tokensSolos } = require('./tokensSolos')
const { findCollectionByName } = require('./findCollectionByName')
const { findCollectionByUser } = require('./findCollectionByUser')
const { findCollectionById } = require('./findCollectionById')
const { redeemTicket } = require('./redeemTicket')
const { burnTicket } = require('./burnTicket')
const { deleteOneTicket } = require('./deleteOneTicket')
const { deleteManyTicket } = require('./deleteManyTicket')
const { createCollectionWithTickets } = require('./createCollectionWithTickets')
const { getCollectionsByAuthorId } = require('./getCollectionsByAuthorId')


module.exports = {
    addTokenToCollection,
    addTokenToCollectionNew,
    createCollection,
    updateCollection,
    viewToken,
    getTicketsByColletion,
    viewTokenById,
    tokensSolos,
    findCollectionByName,
    findCollectionByUser,
    findCollectionById,
    redeemTicket,
    burnTicket,
    deleteOneTicket,
    deleteManyTicket,
    createCollectionWithTickets,
    getCollectionsByAuthorId,
};