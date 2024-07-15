const Message = require("../models/message.model");
const Conversation = require("../models/Conversation.model");

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

function SaveMessage(req, res) {
	const messageModel = new Message();
	const parameters = req.body;
	const senderId = req.params.receiverId;

	console.log(senderId);
	console.log(req.user.sub);
	Conversation.find(
		{ members: { $all: [senderId, req.user.sub] } },
		(err, ConversationFindOne) => {
			console.log(ConversationFindOne);
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
	ViewMessage,
	EditMessage,
	DeleteMessage,
};
