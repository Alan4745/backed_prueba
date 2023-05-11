const mongoose = require('mongoose');

const { Schema } = mongoose;

const channelSchema = new Schema({
	members: {
		type: Array,
		default: [],
	},
	idCommunity: {
		type: String,
		require: true
	},
	idOwner: {
		type: String,
		require: true
	},
	nameChanel: {
		type: String,
		require: true
	},
	passwordChannel: {
		type: String,
	},
	precio:{
		type: Number,
		default: 0
	}
}, { timestamps: true });

module.exports = mongoose.model('channels', channelSchema);
