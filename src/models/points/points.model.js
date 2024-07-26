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
            type: Array, // Can be [longitude, latitude] for Point or an array of arrays for Polygon
            required: true,
            validate: {
                validator: function(value) {
                    if (this.location.type === 'Point') {
                        return value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number';
                    } else if (this.location.type === 'Polygon') {
                        return value.length > 0 && value.every(ring =>
                            Array.isArray(ring) && ring.length > 3 && ring[0].length === 2 &&
                            ring.every(coord => Array.isArray(coord) && coord.length === 2 && typeof coord[0] === 'number' && typeof coord[1] === 'number') &&
                            ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1]
                        );
                    }
                    return false;
                },
                message: props => `${props.value} no es una coordenada válida para ${props.type}`
            }
        }
    },
    radius: {
        type: Number, // en metros
        required: function() {
            return this.location.type === 'Point';
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

pointsSchema.index({ location: '2dsphere' });

const Points = mongoose.model('Points', pointsSchema);

module.exports = { Points };