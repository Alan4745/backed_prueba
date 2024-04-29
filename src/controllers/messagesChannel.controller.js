// const MessagesChannels = require('../models/messagesChannel.model');
// const ChannelCommun = require('../models/channelCommunity.model');
// const User = require('../models/user.model');

// async function saveMessagesChannel(req, res) {
// 	try {
// 		const messageModel = new MessagesChannels();
// 		const parameters = req.body;
// 		const { channelId } = req.params;

// 		messageModel.channelId = channelId;
// 		messageModel.sender = req.user.sub;
// 		messageModel.text = parameters.text;

// 		const channel = await ChannelCommun.findOne({ _id: channelId }).exec();
// 		if (!channel) {
// 			return res.status(404).send({ message: 'Canal no encontrado' });
// 		}

// 		const isMember = channel.members.some((item) => item === req.user.sub);
// 		if (!isMember) {
// 			return res.status(403).send({ message: 'No puede enviar mensajes en este canal' });
// 		}

// 		const saveMessage = await messageModel.save();

// 		return res.status(200).send({ message: saveMessage });
// 	} catch (error) {
// 		return res.status(500).send({ message: 'Error en la petición', error: error });
// 	}
// }


// function viewMessagesChannel(req, res) {
// 	const { channelId } = req.params;
// 	ChannelCommun.findOne({ _id: channelId }, (err, viewMembers) => {
// 		User.find({ _id: viewMembers.members }, { password: 0 }, (err, userFind) => {
// 			MessagesChannels.find(
// 				{ channelId },
// 				(err, messagesView) => res.status(200).send({ messagesView, userFind })
// 			);
// 		});
// 	});
// }

// module.exports = {
// 	saveMessagesChannel,
// 	viewMessagesChannel
// };
