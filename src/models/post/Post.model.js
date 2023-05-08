const mongoose = require('mongoose');
const { Schema } = mongoose;

// Creamos el esquema base para todas las publicaciones
//Publicacion normal
const PublicationSchema = new Schema({
	communityId: { type: String, require: false },
	communityName: { type: String, require: false },
	titulo: { type: String, required: true },
	desc: { type: String, default: '' },
	imagen: {
		public_id: { type: String, default: '', },
		secure_url: { type: String, default: '' }
	},
	video: { type: String, default: '' },
	tipoPublicacion: { type: String, required: false },
	likes: { type: Array, default: [] },
	comments: { type: Array, default: [] },

	// campos adicionales comunes a todas las publicaciones
}, { timestamps: true });

const opinionPostSchema = new Schema({
	options: { type: Array, default: [] },
	answers: { type: Array, default: [] },
});

const eventPostSchema = new Schema({

});

const Publicaciones = mongoose.model('Publications', PublicationSchema);
const Opiniones = Publicaciones.discriminator('opinion_posts', opinionPostSchema);
const Eventos = Publicaciones.discriminator('event_posts', eventPostSchema);


module.exports = { Publicaciones, Opiniones, Eventos };
