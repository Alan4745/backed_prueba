// Importar el modelo de datos Channel desde el archivo channelCommunity.model.js
const Channel = require('../models/channelCommunity.model');

// Definir la función saveChannel que guardará un nuevo canal en la base de datos
async function saveChannel(req, res) {
	try {
		// Crear una nueva instancia de Channel
		const channelModel = new Channel();
		// Obtener los parámetros del cuerpo de la solicitud
		const parameters = req.body;
		// Obtener el id de la comunidad del parámetro de la URL
		const { idCommunity } = req.params;

		console.log(idCommunity);
		console.log(parameters.nameChanel);
        
		// Asignar el id de la comunidad, el id del propietario, el nombre del canal y los miembros a la nueva instancia de Channel
		channelModel.idCommunity = idCommunity;
		channelModel.idOwner = req.user.sub;
		channelModel.nameChanel = parameters.nameChanel;
		channelModel.members = [req.user.sub];
		channelModel.passwordChannel = parameters.passwordChannel;

		// Guardar la nueva instancia de Channel en la base de datos
		const saveChannel = await channelModel.save();

		// Si se guardó correctamente, devolver un mensaje de éxito con el código de estado 200 y la instancia guardada de Channel
		return res.status(200).send({ status: 'Success', saveMessage: saveChannel });
	} catch (error) {
		// Si hay un error, devolver un mensaje de error con el código de estado 500
		return res.status(500).send({ message: 'Error en la petición', error: error });
	}
}

function suscripcionSubCanal(req, res) {
	const { idSubCommunity } = req.params;
	const parameters = req.body;

	console.log(idSubCommunity);

	const subComunidadEncontra = Channel.findOne({_id:idSubCommunity });

	// if (subComunidadEncontra.passwordChannel !== parameters.passwordChannel) {
	// 	return res.status(500).send({ message: 'la contraseña no es correcta' });
	// }

	Channel.findByIdAndUpdate({_id: idSubCommunity}, {$push: { members: req.user.sub } }, {new: true}, (err, subCommunityUpdate)=>{
		if (err) {
			return res.status(500).send({ message: 'error en la peticion' });
		}

		if (!subCommunityUpdate) {
			return res
				.status(500) 
				.send({ message: 'error al actualizar el like de post' });
		}

		return res.status(200).send({ message: subCommunityUpdate });
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

async function verSubCanales(req, res) {
	try {
		const { idcommunity } = req.params;
		const todasSubcomunidades = await Channel.find({ idCommunity: idcommunity }).exec();

		if (todasSubcomunidades.length === 0) {
			return res.status(404).send({ message: 'No se encontraron subcomunidades.' });
		}

		return res.status(200).send({ message: todasSubcomunidades });
	} catch (error) {
		return res.status(500).send({ message: 'Error al buscar las subcomunidades', error: error });
	}
}

// Exportar las funciones saveChannel y viewChannel para que puedan ser utilizadas en otros archivos
module.exports = {
	saveChannel,
	viewChannel,
	verSubCanales,
	suscripcionSubCanal
};
