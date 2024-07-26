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
            default: 'Point',
            required: true
        },
        coordinates: {
            type: Array, // Can be [longitude, latitude] for Point or an array of arrays for Polygon
            required: true,
            validate: {
                validator: function(value) {
                    if (this.location.type === 'Point') {
                        return value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
                    } 
                    return false;
                },
                message: props => `${props.value} no es una coordenada válida para ${props.type}`
            }
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

pointsMarkedSchema.index({ location: '2dsphere' });

const PointsMarked = mongoose.model('PointsMarked', pointsMarkedSchema);

module.exports = { PointsMarked };