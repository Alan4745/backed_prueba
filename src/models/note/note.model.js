const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId, // referencia al usuario remitente
        ref: 'Users',
        required: true
    },
    reciverId: {
        type: Schema.Types.ObjectId, // referencia al usuario receptor
        ref: 'Users',
        required: true
    },
    noteContent: {
        type: String,
        required: true
    },
    statusNote: {
        type: String,
        enum: ['public', 'anonymous'],
        required: true
    },
    coordinates: {
        type: [Number], // Array de números para coordenadas
        required: true
    }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = { Note };
