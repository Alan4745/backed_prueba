const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventsSchema = new Schema({
    image: {
        public_id: { type: String, default: "" },
        secure_url: { type: String, default: "" },
    },
    title: {
        type: String,
        require: true,
    },
    senderId: {
        type: Schema.Types.ObjectId, // referencia al usuario remitente
        ref: "Users",
        required: true,
    },
    reciverIds: {
        type: [Schema.Types.ObjectId], // Arreglo de referencias a usuarios receptores
        ref: "Users",
        required: true,
    },
    type: {
        type: String,
        enum: ["private", "public"],
        required: true,
    },
    coordinates: {
        type: [Number], // Array de números para coordenadas
        required: true,
    },
    radio: {
        type: Number,
        required: true,
        default: 0,
    },
    dateInit: {
        type: String,
        required: true,
        default: "",
    },
    dateEnd: {
        type: String,
        required: true,
        default: "",
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Events = mongoose.model('Events', eventsSchema);

module.exports = { Events };
