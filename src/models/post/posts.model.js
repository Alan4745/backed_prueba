const mongoose = require('mongoose');

const { Schema } = mongoose;

const picSchema = new Schema({
	public_id: {
		type: String,
		default: ''
	},
	secure_url: {
		type: String,
		default: ''
	},
});

const commentSchema = new Schema({
	userId: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	date: {
		type: String,
		required: true,
		default: ''
	},
	rating: {
		type: Number
	},
});

const eventSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	fechaI: {
		type: String,
		required: true
	},
	fechaF: {
		type: String,
		required: true
	},
	req: {
		type: [String],
		default: []
	},
	coordinates: {
		type: Schema.Types.Mixed,
		required: true
	},
	pictures: {
		type: [picSchema],
		required: false
	},

});

const votesSchema = new Schema({
	option1: {
		type: [String],
		default: []
	},
	option2: {
		type: [String],
		default: []
	},
	option3: {
		type: [String],
		default: []
	},
	option4: {
		type: [String],
		default: []
	},
});

const pollSchema = new Schema({
	question: {
		type: String,
		required: true,
		default: ''
	},
	desc: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	coordinates: {
		type: Schema.Types.Mixed,
		required: true
	},
	options: {
		type: [String],
		required: true
	},
	votes: {
		type: votesSchema
	},
});

const normalSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	desc: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: false,
	},
	coordinates: {
		type: Schema.Types.Mixed,
		required: true
	},
	pictures: {
		type: [picSchema],
		required: true,
		default: []
	},
});

const postSchema = new Schema(
  {
    author: { type: String, required: true },
	dataAuthor: {
		author: { type: String, default: '' },
		authorName: { type: String, default: '' },
		image: {
			public_id: { type: String, default: '' },
			secure_url: { type: String, default: '' },
		},
	},
    image: {
      public_id: { type: String, default: '' },
      secure_url: { type: String, default: '' },
    },
    type: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: false },
    comments: { type: [commentSchema], default: [] },
    likes: {
      type: [{
        userId: { type: String, required: true },
      }],
      default: [],
    },
    originalPost: { type: String, default: null },
  },
  { timestamps: true, discriminatorKey: 'type' }
);

const Post = mongoose.model('Post', postSchema);
const EventPost = Post.discriminator('Event', eventSchema);
const PollPost = Post.discriminator('Poll', pollSchema);
const NormalPost = Post.discriminator('Normal', normalSchema);

module.exports = { Post, EventPost, PollPost, NormalPost };
