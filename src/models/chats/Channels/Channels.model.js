const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChannelSchema = new Schema({
	members: {
		type: Array,
		default: [],
	},
	admins: {
		type: Array,
		default: [],
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
	price:{
		type: Number,
		default: 0
	},
	private: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });


module.exports = mongoose.model('channels', ChannelSchema);
