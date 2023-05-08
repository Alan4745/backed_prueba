const mongoose = require('mongoose');

const { Schema } = mongoose;

const postActivitySchema = new Schema({
	communityId: {
		type: String
	},
	communityName: {
		type: String
	},
	question: {
		type: String,
		require: true,
	},
	imagenPostTypeA: {
		public_id: {
			type: String,
			default: '',
		},
		secure_url: {
			type: String,
			default: ''
		}
	},
	options: {
		type: Array,
		default: []
	},
	answers: {
		type: Array,
		default: []
	},
	likes: {
		type: Array,
		default: [],
	},
	comentarios: {
		type: Array,
		default: [],
	},
	commentPost: {
		type: Boolean,
	},
	typePost: {
		type: String,
		default: 'activity'
	}
},
{
	timestamps: true
},
);

module.exports = mongoose.model('postActivities', postActivitySchema);