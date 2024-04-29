const mongoose = require('mongoose');

const { Schema } = mongoose;

const PrivateConversastionsSchema = new Schema({
	members1: {
		type: String,
	},
	members2: {
		type: String,
	},
	locked: {
		type: Boolean,
		default: false
	}
}, { timestamps: true });


module.exports = mongoose.model('privateConversastions', PrivateConversastionsSchema);
