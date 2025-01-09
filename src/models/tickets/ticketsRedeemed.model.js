const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketsRedeemedSchema = new Schema({
    amountRedeemed: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String, // 'Point'
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number], // Array de números para coordenadas
            required: true
        }
    },
    idTicketsMarked: {
        type: Schema.Types.ObjectId, // referencia a los puntos a canjear
        ref: 'TicketsMarked',
        required: true
    },
    collectionName: {
        type: String,
        required: false
    },
    receiver: {
        type: Schema.Types.ObjectId, // referencia al usuario receptor
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TicketsRedeemed = mongoose.model('TicketsRedeemed', ticketsRedeemedSchema);

module.exports = { TicketsRedeemed };