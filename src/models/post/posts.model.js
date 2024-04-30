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
		type: Number| undefined,
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
		required: true,
	},
});

const votesSchema = new Schema({
	option1: {
		type: [String],
		default: [],
	},
	option2: {
		type: [String],
		default: [],
	},
	option3: {
		type: [String],
		default: [],
	},
	option4: {
		type: [String],
		default: [],
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
	},
	options: {
		type: [String],
		required: true,
	},
	votes: {
		type: votesSchema,
	},
});

const normalSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	pictures: {
		type: [picSchema],
		required: true,
	},
});

const postSchema = new Schema(
	{
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
			default: 'Normal',
			required: true,
		},
		content: {
			type: Schema.Types.Mixed,
			required: true,
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
	}, { timestamps: true}
);

// discriminators
postSchema.discriminator('Event', eventSchema);
postSchema.discriminator('Poll', pollSchema);
postSchema.discriminator('Normal', normalSchema);

module.exports = mongoose.model('posts', postSchema);