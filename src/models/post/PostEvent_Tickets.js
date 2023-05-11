const mongoose = require('mongoose');

const { Schema } = mongoose;

const post_event_tickets = new Schema({
	communityId: {
		type: String,
	},
	communityName: {
		type: String,
	}, 
	title: {
		type: String,
		require: true
	}, 
	desc: {
		type: String,
		max: true,
	},
	imagenPostTypeC: {
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
	typePost: {
		type: String,
		default: 'PostTypeC'
	},
	ubicacion:{
		type: Array,
		default:[]
	}
});

module.exports = mongoose.model('event_tickets', post_event_tickets);