const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenUnitarySchema = new Schema({
	hash: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		require: true
	},
	desc: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		required: true
	},
	img: {
		imgUrl: {
			type: String,
			default: ''
		},
		imgId: {
			type: String,
			default: ''
		}
	},
	author: {
		type: String,
		require: true
	},
	buyers: {
		type: Array,
		default: []
	}
}, { timestamps: true });

module.exports = mongoose.model('tokenUnitarys', tokenUnitarySchema);
