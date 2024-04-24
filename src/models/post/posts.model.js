const mongoose = require('mongoose');

const { Schema } = mongoose;

const picSchema = new Schema({
	public_id: {
		type: String,
		default: '',
	},
	secure_id: {
		type: String,
		default: '',
	},
});

const commentSchema = new Schema({
	userId: {
		type: String,
		required: true,
	},
	text: {
		type: String,
		default: '',
		required: true,
	},
	date: {
		type: String,
		required: true,
		default: '',
	},
	rating: {
		type: Number,
		default: 1,
	},
});

const eventSchema = new Schema({
	name: {
		type: String,
		required: String,
	},
	desc: {
		type: String,
		required: String,
	},
	fechaI: {
		type: String,
		required: String,
	},
	fechaF: {
		type: String,
		required: String,
	},
	req: {
		type: [String],
		default: [],
	},
	coordinates: {
		type: [Number],
		default: [],
	},
	ubicacion: {
		type: String,
	},
	pictures: {
		type: [picSchema],
		required: String,
	},
});

const pollSchema = new Schema({
	question: {
		type: String,
		required: true,
		default: '',
	},
	desc: {
		type: String,
		required: true,
		default: '',
	},
	options: {
		type: [String],
		default: [],
		required: true,
	},
	votes: {
		type: {
			option1: {
				type: [String],
				default: []
			},
			option2: {
				type: [String],
				default: []
			},
			option4: {
				type: [String],
				default: []
			},
			option5: {
				type: [String],
				default: []
			},
		},
		required: true,
	}, 
	availableuntil: {
		type: String,
		required: true,
	}
});

const normalSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: '',
	},
	pictures: {
		type: [picSchema],
		required: String,
	},
});

const postSchema = new Schema({
	author: {
		type: String,
		required: true,
	},
	image: {
		type: {
			public_id: {
				type: String,
				default: '',
			},
			secure_url: {
				type: String,
				default: '',
			},
		},
		required: true,
	},
	type: {
		type: String,
		default: 'NormalPost',
		required: true,
	},
	content: {
		type: eventSchema | pollSchema | normalSchema,
	},
	comments : {
		type: [commentSchema],
		default: [],
	},
	likes: {
		type: [{
			userId: {
				type: String,
				required: true,
			},
			date: {
				type: String,
				required: true,
			}
		}],
		default: [],
		required: true,
	},
});

module.exports = mongoose.model('posts', postSchema);