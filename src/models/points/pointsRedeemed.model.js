const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointsRedeemedSchema = new Schema({
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
    collectionName: {
        type: String,
        required: false
    },
    idPointsMarked: {
        type: Schema.Types.ObjectId, // referencia a los puntos a canjear
        ref: 'PointsMarked',
        required: true
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

const PointsRedeemed = mongoose.model('PointsRedeemed', pointsRedeemedSchema);

module.exports = { PointsRedeemed };