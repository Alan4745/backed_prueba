// Importar el modelo de datos Channel desde el archivo channelCommunity.model.js
const Channel = require('../models/channelCommunity.model');

// Definir la función saveChannel que guardará un nuevo canal en la base de datos
function saveChannel(req, res) {
	// Crear una nueva instancia de Channel
	const channelModel = new Channel();
	// Obtener los parámetros del cuerpo de la solicitud
	const parameters = req.body;
	// Obtener el id de la comunidad del parámetro de la URL
	const { idCommunity } = req.params;

	// Asignar el id de la comunidad, el id del propietario, el nombre del canal y los miembros a la nueva instancia de Channel
	channelModel.idCommunity = idCommunity;
	channelModel.idOwner = req.user.sub;
	channelModel.nameChanel = parameters.nameChanel;
	channelModel.members = [req.user.sub];

	// Guardar la nueva instancia de Channel en la base de datos
	channelModel.save((err, saveChannel) => {
		if (err) {
			// Si hay un error, devolver un mensaje de error con el código de estado 500
			return res.status(500).send({ message: 'err en la peticion', err });
		}
		if (!saveChannel) {
			// Si no se pudo guardar el canal, devolver un mensaje de error con el código de estado 500
			return res.status(500).send({ message: 'err al guardar el Canal' });
		}
		// Si se guardó correctamente, devolver un mensaje de éxito con el código de estado 200 y la instancia guardada de Channel
		return res
			.status(200)
			.send({ status: 'Success', saveMessage: saveChannel });
	});
}

// Definir la función viewChannel que buscará y devolverá todos los canales en los que el usuario actual es miembro
function viewChannel(req, res) {
	// Buscar todos los canales en los que el usuario actual es miembro
	Channel.find({ members: { $all: [req.user.sub] } }, (_err, channelFind) => {
		// Devolver un objeto con el código de estado 200 y los canales encontrados
		res.status(200).send({ channel: channelFind });
	});
}

function verSubCanales(req, res) {
	const { idcommunity } = req.params;

	Channel.find({idCommunity: idcommunity}, (_err, todasSubcomunidades ) => {

		if (_err) {
			return res.status().send({message: 'error al buscar las subcomunidades'});
		}

		return res.status(200).send({message: todasSubcomunidades});

	});
}

// Exportar las funciones saveChannel y viewChannel para que puedan ser utilizadas en otros archivos
module.exports = {
	saveChannel,
	viewChannel,
	verSubCanales
};
