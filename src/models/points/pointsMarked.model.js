const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointsMarkedSchema = new Schema({
    amountPointsMarked: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String, // 'Point'
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number], // Array de números para coordenadas
            required: true
        }
    },
    idPoints: {
        type: Schema.Types.ObjectId, // referencia a los puntos a marcar en el mapa
        ref: 'Points',
        required: true
    },
    redeemed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PointsMarked = mongoose.model('PointsMarked', pointsMarkedSchema);

module.exports = { PointsMarked };
