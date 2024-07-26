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

pointsRedeemedSchema.index({ location: '2dsphere' });

const PointsRedeemed = mongoose.model('PointsRedeemed', pointsRedeemedSchema);

module.exports = { PointsRedeemed };