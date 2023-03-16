/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint no-shadow: ["error", { "builtinGlobals": true }] */
const Conversation = require('../models/Conversation.model');
const User = require('../models/user.model');

function NewConversation(req, res) {
	const modelConversation = new Conversation();
	const senderId = req.params.receiverId;

	console.log(req.user.sub);
	console.log(senderId);

	Conversation.find({ members: { $all: [senderId, req.user.sub] } }, (err, conversationFind) => {
		// Verificamos si los usuarios obtubieron una conversacion anterior
		if (conversationFind.length > 0) {
			return res
				.status(500)
				.send({ error: { message: 'ya Tienes una conversiancion el con este usuario' } });
		}
		modelConversation.members = [req.user.sub, senderId];
		modelConversation.save((err, saveConversation) => {
			if (err) {
				return res.status(500)
					.send({ message: 'err en la peticion' });
			}
			if (!saveConversation) {
				return res.status(500)
					.send({ message: 'error al guardar la conversacion' });
			}
			// return res.status(200).send({ status: 'Success', saveConversation });
		});
	});
}

function ConversationIdUser(req, res) {
	const senderId = req.params.receiverId;

	Conversation.findOne(
		{ members: { $elemMatch: { senderId: req.user.sub, receiverId: senderId } } },
		(err, conversationFindIdUser) => {
			if (err) {
				return res.status(500)
					.send({ Error: 'err en la peticion' });
			}
			if (!conversationFindIdUser) {
				return res.status(500)
					.send({ Error: 'Este Usuario No tiene conversacion con tu usuario' });
			}

			return res.status(200).send({ status: 'Success', conversationFindIdUser });
		},
	);
}

function ConversationView(req, res) {
	Conversation.find({ members: { $all: [req.user.sub] } }, (err, friedsViews) => {
		if (err) return res.status(500).send({ err: 'Error en la peticion de friedsViews' });
		if (!friedsViews) res.status(500).send({ err: 'No se encontro friends' });

		const friends = [];

		for (let i = 0; i < friedsViews.length; i += 1) {
			const element = friedsViews[i].members;
			for (let i = 0; i < element.length; i += 1) {
				const element1 = element[i];
				friends.push(element1);
			}
		}

		const friendsCa = friends.filter((a) => a !== req.user.sub);

		User.find(
			{ _id: friendsCa },
			{ password: 0 },
			(err, friedsFind) => res.status(200).send({ friedsFind })
		);
	});
}

module.exports = {
	NewConversation,
	ConversationIdUser,
	ConversationView,
};
