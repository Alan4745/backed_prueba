const Conversation = require('../models/Conversation.model')

function NewConversation(req, res) {
    const modelConversation = new Conversation();
    var senderId = req.params.receiverId;

    Conversation.find({ members: { $elemMatch: { senderId: req.user.sub, receiverId: senderId } } }, (err, conversationFind) => {
        //Verificamos si los usuarios obtubieron una conversacion anterior
        if (conversationFind.length > 0) {
            return res
                .status(500)
                .send({ error: { message: 'ya Tienes una conversiancion el con este usuario' } });
        } else {
            modelConversation.members = [{ senderId: req.user.sub, receiverId: senderId }];
            modelConversation.save((err, saveConversation) => {
                if (err) return res.status(500)
                    .send({ message: 'err en la peticion' });
                if (!saveConversation) return res.status(500)
                    .send({ message: 'error al guardar la conversacion' });
                return res.status(200).send({ status: 'Success', saveConversation });
            });
        }
    });
}


function ConversationIdUser(req, res) {
    var senderId = req.params.receiverId;

    Conversation.findOne({ members: { $elemMatch: { senderId: req.user.sub, receiverId: senderId } } }, (err, conversationFindIdUser) => {
        if (err) return res.status(500)
            .send({ Error: 'err en la peticion' });
        if (!conversationFindIdUser) return res.status(500)
            .send({ Error: 'Este Usuario No tiene conversacion con tu usuario' });

        console.log(conversationFindIdUser.id)

        return res.status(200).send({ status: 'Success', conversationFindIdUser });
    });


}


module.exports = {
    NewConversation,
    ConversationIdUser
}