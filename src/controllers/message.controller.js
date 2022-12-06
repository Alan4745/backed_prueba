const Message = require('../models/message.model');

function SaveMessage(req, res) {
    const messageModel = new Message();
    var parameters = req.body;
    var senderId = req.params.receiverId;



    messageModel.message = parameters.message;
    messageModel.from = parameters.from;

    messageModel.save((err, saveMessage) => {
        if (err) return res.status(500)
            .send({ message: 'err en la peticion' });

        if (!saveMessage) return res.status(500)
            .send({ message: 'err al guardar el usuario' });

        return res.status(200).send({ status: 'Success', saveMessage });
    })


}



function ViewMessage(req, res) {
    Message.find((err, messageView) => {
        return res.status(200).send({ status: 'Success', messageView })
    })
}


module.exports = {
    SaveMessage,
    ViewMessage
}