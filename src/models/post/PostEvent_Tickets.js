const mongoose = require('mongoose');

const { Schema } = mongoose;

const post_event_tickets = new Schema({
	communityId: {
		type: String,
	},
	collectionId: {
		type: String,
	},
	collectionName: {
		type: String,
	},
	communityName: {
		type: String,
	}, 
	titulo: {
		type: String,
		require: true
	}, 
	desc: {
		type: String,
		max: true,
	},
	imagen: {
		public_id: {
			type: String,
			default: '',
		}, 
		secure_url: {
			type: String,
			default: ''
		}
	},
	likes: {
		type: Array, 
		default: [],
	}, 
	comentarios: {
		type: Array, 
		default: [],
	},
	tipoPublicacion: {
		type: String,
		default: ''
	},
	ubicacion:{
		type: Array,
		default:[]
	}
});


const evento_tickets= mongoose.model('evento_tickets', post_event_tickets);

module.exports ={
	evento_tickets
};