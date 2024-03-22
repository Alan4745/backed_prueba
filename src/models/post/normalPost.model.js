const mongoose = require('mongoose');

const { Schema } = mongoose;

const normalPostSchema = new Schema(
	{
		title: {
			type: String,
			require: true,
		},
		images: {
			type: Array,
			default: [Object]
		},
		imagenCover: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},
		desc: {
			type: String,
		},
		video: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},

		publicationType: {
			type: String,
			require: true,
		},
		reactions: {
			type: Array,
			default: []
		},
		comments: {
			type: Array,
			default: [Object]
		},
        
		idCommunity: {
			type: String,
			require: true
		}
	},
	{ timestamps: true }
);



const PostNormal = mongoose.model('normalPost', normalPostSchema);


module.exports =  PostNormal ;