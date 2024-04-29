const mongoose = require('mongoose');

const { Schema } = mongoose;

const PrivateMessagesSchema = new Schema({
	PrivateConversationsId: {
		type: String,
	},
	sender: {
		type: String,
	},
	text: {
		type: String,
	},
}, { timestamps: true });

module.exports = mongoose.model('PrivateMessages', PrivateMessagesSchema);