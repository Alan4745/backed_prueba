const Message = require("../models/message.model");
const Conversation = require("../models/Conversation.model");
const User = require("../models/user.model");

async function ViewMessage(req, res) {
	const senderId = req.params.receiverId;

	const findConversatio = await Conversation.find({members: {$all: [senderId, req.user.sub]}});
	console.log(findConversatio);
	Conversation.find(
		{ members: { $all: [senderId, req.user.sub] } },
		(err, ConversationFindOne) => {
			if (err) {
				return res.status(500).send({ error: err });
			}
			console.log(ConversationFindOne);
			Message.find(
				{ conversationId: ConversationFindOne.id },
				(err, messageView) =>
					res.status(200).send({ status: "Success", messageView })
			);
		}
	);
}
async function ViewMessageById(req, res) {
	const conversationId = req.params.conversationId;

	try {
		// Verificar si la conversación existe
		const conversation = await Conversation.findById(conversationId);
		if (!conversation) {
			return res.status(404).send({ error: "Conversation not found" });
		}

		// Obtener mensajes de la conversación y ordenarlos por fecha de creación (ascendente)
		const messages = await Message.find({ conversationId: conversationId }).sort({ createdAt: -1 });

		// Obtener información de los usuarios
		const userIds = messages.map(message => message.sender);
		const users = await User.find({ _id: { $in: userIds } }).select('name imageAvatar.secure_url');

		// Crear un mapa de usuarios para acceso rápido
		const userMap = {};
		users.forEach(user => {
			userMap[user._id] = {
				name: user.name,
				imageAvatar: user.imageAvatar.secure_url,
			};
		});

		// Agregar el nombre y la imagen de avatar a cada mensaje
		const messageView = messages.map(message => ({
			...message.toObject(),
			senderName: userMap[message.sender]?.name || '',
			imageAvatar: userMap[message.sender]?.imageAvatar || '',
		}));

		// Enviar la respuesta con los mensajes ordenados
		res.status(200).send({ status: "Success", messageView });
	} catch (err) {
		return res.status(500).send({ error: err.message });
	}
}

function SaveMessage(req, res) {
	const messageModel = new Message();
	const parameters = req.body;
	const senderId = req.params.receiverId;

	Conversation.find(
		{ members: { $all: [senderId, req.user.sub] } },
		(err, ConversationFindOne) => {
			if(ConversationFindOne.length == 0){
				return res.status(500).send({message: 'No se encontro la conversacion con este usuario.'})
			}
			messageModel.conversationId = ConversationFindOne[0]._id
			messageModel.sender = req.user.sub;
			messageModel.text = parameters.text;

			messageModel.save((err, saveMessage) => {
				if (err) {
					return res.status(500).send({ message: "err en la peticion", err });
				}

				if (!saveMessage) {
					return res.status(500).send({ message: "err al guardar el usuario" });
				}

				return res.status(200).send({ status: "Success", saveMessage });
			});
		}
	);
}

function SaveMessageGlobal(req, res) {
	const messageModel = new Message();
	const parameters = req.body;
	const conversationId = req.params.conversationId;

	Conversation.findOne({ _id: conversationId },
		(err, ConversationFindOne) => {
			if(err) {
				res.status(500).send({message: err})
			}
			if(ConversationFindOne.length == 0){
				return res.status(500).send({message: 'No se encontro la conversacion con este usuario.'})
			}
			messageModel.conversationId = conversationId
			messageModel.sender = req.user.sub;
			messageModel.text = parameters.text;

			messageModel.save((err, saveMessage) => {
				if (err) {
					return res.status(500).send({ message: "err en la peticion", err });
				}

				if (!saveMessage) {
					return res.status(500).send({ message: "err al guardar el usuario" });
				}

				return res.status(200).send({ status: "Success", saveMessage });
			});
		}
	);
}

async function EditMessage(req, res) {
	const parameters = req.body;
	const idMessage = req.params.messageId;

	const findMessage = await Message.findById({ _id: idMessage });
	if (!findMessage) {
		return res
			.status(404)
			.send({ message: "Mensaje no encontrado." });
	}

	findMessage.text = parameters.text;

	findMessage.save();

	return res.status(200).send({ message: "Mensaje editado." });
}
async function DeleteMessage(req, res) {
	const idMessage = req.params.messageId;

	const deleteMessage = await Message.findByIdAndDelete({ _id: idMessage });
	if (!deleteMessage) {
		return res
			.status(404)
			.send({ message: "Mensaje no encontrado." });
	}

	return res.status(200).send({ status: "Mensaje eliminado." });
}

module.exports = {
	SaveMessage,
	SaveMessageGlobal,
	ViewMessage,
	ViewMessageById,
	EditMessage,
	DeleteMessage,
};
