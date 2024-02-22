const mongoose = require('mongoose');

const { Schema } = mongoose;

const communitySchema = new Schema(
	{
		nameCommunity: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			max: 500,
			default: 'Escribe Tu descripcion de Tu comunidad'
		},
		like: {
			type: Array,
			default: [],
		},
		followers: {
			type: Array,
			default: [],
		},
		followings: {
			type: Array,
			default: [],
		},
		category: {
			type: Array,
			default: [],
		},
		idOwner: {
			type: String,
		},
		nameOwner: {
			type: String,
		},
		administrators: {
			type: Array,
			default: [],
		},
		verificado: {
			type: Boolean,
			default: false,
		},
		config: {
			bannerUrl: {
				public_id: {
					type: String,
					default: '',
				},
				secure_url: {
					type: String,
					default: '',
				},
			},
			imagePer: {
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
