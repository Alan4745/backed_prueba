const Channels = require('../../models/chats/Channels/Channels.model');


async function saveChannel(req, res) {
	try {
		const channelModel = new Channels();

		const parameters = req.body;

		if (!parameters.nameChanel) {
			return res.status(400).send({ message: 'Missing data in the request.' });
		}
  


		channelModel.members = [];
		channelModel.admins = [req.user.sub];
		channelModel.price = parameters.price;
		channelModel.private = parameters.private;
		channelModel.idOwner = req.user.sub;
		channelModel.nameChanel = parameters.nameChanel;
		channelModel.passwordChannel = parameters.passwordChannel;

		const saveChannel = await channelModel.save();

		return  res.status(200).send({status: 'Success', message: saveChannel});
        
	} catch (error) {
		return res.status(500).send({ message: 'Error en la petición', error: error });
	}
}

module.exports = {
	saveChannel
};