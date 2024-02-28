const mongoose = require('mongoose');

const { Schema } = mongoose;

const communitySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
			default: 'Escribe Tu descripcion de Tu comunidad'
		},
		nameOwner: {
			type: String,
		},
		categories: {
			type: Array,
			default: [],
		},
		followers: {
			type: Array,
			default: [],
		},
		admins: {
			type: Array,
			default: [],
		},
		verified: {
			type: Boolean,
			default: false,
		},
		config: {
			bgImage: {
				public_id: {
					type: String,
					default: '',
				},
				secure_url: {
					type: String,
					default: '',
				},
			},
			pfp: {
				public_id: {
					type: String,
					default: '',
				},
				secure_url: {
					type: String,
					default: '',
				},
			}
		}
	},
	{ timestamps: true },
);

module.exports = mongoose.model('communitys', communitySchema);
