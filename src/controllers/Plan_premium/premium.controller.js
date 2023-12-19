//canal verificado 
const community=require('./../../models/community.model');

async function verificacion(req, res) {
	console.log('LLEGAR ACA');
	community.findOne({ _id: req.params.verificado}, (_err, find_verificado) => {
		console.log('llegamos a la parte premium');
		if (find_verificado.verificado) {
			return res.status(200).send({ message: 'tu ya tienes una cuenta premium' });
		}
		community.findByIdAndUpdate(req.params.verificado, { verificado: true }, { new: true }, (err, cambiando_verificado) => {
			return res.status(200).send({ message: cambiando_verificado });
		});

	});
}

module.exports = {
	verificacion
};



// Mostrar usuarios que pueden ver o no a la comunidad 

//acceso con codigo ala comunidad 

//que la comunidad sea visible en el buscador o no 

//personalizar el canal //limitaciones en el mapa 



//tamaño de los archivos al chat 



//cantidad acitivdades que podes subir en el mundo AR

//CUUNADO ESCANES UN OBJETO PASE ALGO CREATIVO DE AR 

//SUPER COMUNIDAD MADRE 

//SUBIR STICKERS PERSONALES 

//ENLACE PERSONALIZADO DE INVITACION DEL SERVIDOR

//creacion de avatar 
