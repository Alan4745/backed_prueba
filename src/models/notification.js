const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    recipient: { // Usuario que recibe la notificación
        type: [String],
        default: [],
        required: true,
    },
    sender: { // Usuario que genera la notificación
        type: String,        
        required: true,
    },
    post: { // Post relacionado con la notificación (si aplica)
        type: String,
        default: null,
    },
    type: { // Tipo de notificación (like, comment, share, etc.)
        type: String,
        required: true,
        enum: [],
    },
    message: { // Mensaje opcional para la notificación
        type: String,
        default: '',
    },
    read: { // Indica si la notificación ha sido vista
        type: Boolean,
        default: false,
    },
    createdAt: { // Fecha de creación de la notificación
        type: Date,
        default: Date.now,
    },
});

async function createNotification(recipientId, senderId, postId, type, message) {
    try {
      const notification = new Notification({
        recipient: recipientId,
        sender: senderId,
        post: postId,
        type: type,
        message: message,
      });
  
      await notification.save();
    } catch (error) {
      console.error('Error al crear la notificación:', error);
    }
  }
  

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {Notification, createNotification};
