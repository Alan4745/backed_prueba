const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventPostSchema = new Schema(
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

		location: {
			type: Array,
			default: []
		},

		collections: {
			type: Array,
			default: [String]
		},
        
		idCommunity: {
			type: String,
			require: true
		},
		startDate: {
			type: String
		},
		endingDate: {
			type: String
		},
		requirements: {
			type: Array,
			default: [String]
		}
	},
	{ timestamps: true }
);



const PostEvent = mongoose.model('eventPost', eventPostSchema);


module.exports =  PostEvent ;