const mongoose = require('mongoose');
const { Schema } = mongoose;

const pointsSchema = new Schema({
    amount: {
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
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    radius: {
        type: Number, // en metros
        required: true
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

pointsSchema.index({ location: '2dsphere' });

const Points = mongoose.model('Points', pointsSchema);

module.exports = { Points };