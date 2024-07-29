const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointsSchema = new Schema({
    amountCurrent: {
        type: Number,
        required: true
    },
    amountInitial: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String, // 'Point' or 'Polygon'
            enum: ['Point', 'Polygon'],
            required: true
        },
        coordinates: {
            type: Schema.Types.Mixed,
            required: true
        }
    }, 
    emitter: {
        type: Schema.Types.ObjectId, // referencia al usuario emisor
        ref: 'Users',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Points = mongoose.model('Points', pointsSchema);

module.exports = { Points };
