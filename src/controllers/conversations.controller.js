const Conversation = require('../models/Conversation.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

function NewConversation(req, res) {
	const modelConversation = new Conversation();
	const senderId = req.params.receiverId;

	// Verificamos si ya existe una conversación entre los dos usuarios
	Conversation.find({ members: { $all: [senderId, req.user.sub] } }, (err, conversationFind) => {
		// Verificamos si los usuarios son el mismo (no puedes crear una conversación contigo mismo)
		if (senderId == req.user.sub) {
			return res.status(500).send({
				error: { message: 'No puedes crear una conversación contigo mismo.' }
			});
		}

		// Si ya existe una conversación, retornamos 304 con el ID de la conversación
		if (conversationFind.length > 0) {
			const conversationId = conversationFind[0]._id;  // Obtén el ID de la conversación existente
			return res.status(203).send({
				message: 'Ya tienes una conversación con este usuario.',
				conversationId: conversationId.toString() // Asegúrate de enviar el ID como string
			});
		}

		// Si no hay una conversación existente, se crea una nueva
		modelConversation.members = [req.user.sub, senderId];
		modelConversation.save((err, saveConversation) => {
			if (err) {
				return res.status(500).send({
					message: 'Error en la petición'
				});
			}
			if (!saveConversation) {
				return res.status(500).send({
					message: 'Error al guardar la conversación'
				});
			}
			return res.status(200).send({
				status: 'Success',
				conversationId: saveConversation._id.toString(),
				saveConversation
			});
		});
	});
}


async function NewConversationGroup(req, res) {
	const memberIds = req.body.members;

	if (!memberIds || memberIds.length < 2) {
		return res.status(400).send({ error: { message: 'El grupo debe tener al menos dos miembros.' } });
	}

	memberIds.map(users => {
		const findUser = User.findById([{ _id: users }]);

		if (!findUser) {
			return res.status(400).send({ message: 'alguno de los usuarios no existen.' })
		}
	})

	Conversation.findOne({ members: { $all: memberIds, $size: memberIds.length } }, (err, existingConversation) => {
		if (err) {
			return res.status(500).send({ message: 'Error en la búsqueda de la conversación.' });
		}

		if (existingConversation) {
			return res.status(400).send({ error: { message: 'Ya existe una conversación con estos miembros.' } });
		}

		// Agregar el usuario a los miembros
		memberIds.push(req.user.sub);

		// Crear una nueva conversación
		const newConversation = new Conversation({ members: memberIds });

		newConversation.save((err, savedConversation) => {
			if (err) {
				return res.status(500).send({ message: 'Error al guardar la conversación.' });
			}

			return res.status(200).send({ status: 'Success', message: 'Grupo creado.', conversation: savedConversation });
		});
	});

}

async function DeleteConversation(req, res) {

	const conversationId = req.params.conversationId;

	const deleteConversation = await Conversation.findByIdAndDelete({ _id: conversationId });
	if (!deleteConversation) {
		return res
			.status(404)
			.send({ message: "Conversacion no encontrada." });
	}

	return res.status(200).send({ status: "Conversacion eliminada." });
}

async function deleteConversation(req, res) {
	const conversationId = req.params.conversationId;

	try {
		// Buscar la conversación por su ID
		const conversation = await Conversation.findById({ _id: conversationId });

		if (!conversation) {
			return res.status(404).send({ message: "Conversación no encontrada" });
		}

		// Eliminar los mensajes de la conversación encontrada
		await Message.deleteMany({ conversationId: conversationId });

		// Eliminar la conversación
		await conversation.delete();

		return res.status(200).send({ message: "Conversación y mensajes eliminados correctamente" });
	} catch (error) {
		return res.status(500).send({ message: "Error al eliminar la conversación y sus mensajes", error });
	}
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
			(err, friedsFind) => res.status(200).send({ friedsFind, friedsViews })
		);
	});
}

async function ConversationByUser(req, res) {
	try {
		const userId = req.user.sub;

		// Obtener las conversaciones del usuario
		const conversations = await Conversation.find({ members: userId });

		if (!conversations || conversations.length === 0) {
			return res.status(404).send({ err: 'No se encontró ninguna conversación' });
		}

		// Crear una lista para almacenar los datos finales
		const conversationDetails = await Promise.all(conversations.map(async (conversation) => {
			// Obtener los otros miembros de la conversación (excluyendo al usuario actual)
			const otherMemberId = conversation.members.find(member => member.toString() !== userId);

			// Asegurarse de que `otherMemberId` sea un ObjectId válido
			if (!mongoose.Types.ObjectId.isValid(otherMemberId)) {
				console.error(`Invalid ObjectId for otherMemberId: ${otherMemberId}`);
				return null; // Si no es válido, no se devuelve nada para esta conversación
			}

			// Obtener información del usuario (nombre e imagen) del otro miembro
			const userInfo = await User.findById(otherMemberId).select('name imageAvatar.secure_url');

			// Obtener el último mensaje de la conversación
			const lastMessage = await Message.findOne({ conversationId: conversation._id })
				.sort({ createdAt: -1 })
				.select('text createdAt');

			return {
				conversationId: conversation._id.toString(),
				otherMemberId: otherMemberId.toString(), // Convertir a cadena si es necesario
				otherMemberName: userInfo ? userInfo.name : 'Usuario desconocido',
				otherMemberImage: userInfo && userInfo.imageAvatar ? userInfo.imageAvatar.secure_url : '',
				lastMessage: lastMessage ? lastMessage.text : 'No hay mensajes aún',
				lastMessageTimestamp: lastMessage ? lastMessage.createdAt : null,
			};
		}));

		// Filtrar las conversaciones nulas
		const filteredConversations = conversationDetails.filter(convo => convo !== null);

		// Devolver los detalles de las conversaciones
		return res.status(200).send({
			status: "Success",
			conversations: filteredConversations
		});

	} catch (err) {
		console.error('Error en ConversationByUser:', err);
		return res.status(500).send({
			err: 'Error en la petición de conversaciones',
			details: err.message
		});
	}
}

module.exports = {
	NewConversation,
	NewConversationGroup,
	ConversationIdUser,
	ConversationView,
	ConversationByUser,
	DeleteConversation,
	deleteConversation
};
