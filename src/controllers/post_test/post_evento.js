const { Post_evento } = require('./../../models/post/PostEvent.model');
const communityModel = require('./../../models/community.model');
const { UploadImg, UploadVideo } = require('../../utils/cloudinary');


async function eliminar_evento(req, res) {
    Post_evento.findByIdAndDelete({ _id: req.params.id_evento }, (err, delete_post) => {
        return res.status(200).send({ message: delete_post })
    })
}
//BUSCAR EVENTO POR ID DE LA COMUNIDAD 
async function buscar_evento(req, res) {
    Post_evento.find({ communityId: req.params.id }, (err, find_evento) => {
        return res.status(200).send({ message: find_evento })
    })
}
//BUSCAR EVENTO POR ID DEL EVENTO
async function buscar_evento_id(req, res) {
    Post_evento.findOne({ _id: req.params.evento_id }, (err, find_evento_id) => {
        return res.status(200).send({ message: find_evento_id })
    })
}

async function editar_evento(req, res) {
    console.log(req.params.evento_id + 'estamos aqui');
    Post_evento.findByIdAndUpdate(req.params.evento_id, {titulo: req.body.titulo, desc: req.body.desc}, {new: true},(err, update_evento) => {
        return res.status(200).send({ message: update_evento })
    })
}




//crear funcion de crear evento sin tickets 
async function crear_evento(req, res) {
    const evento_model = new Post_evento();
    const parameters = req.body;

    evento_model.titulo = parameters.titulo;
    evento_model.desc = parameters.descripcion;
    evento_model.tipoPublicacion = "evento_sin_ticket";
    evento_model.ubicacion=[{
        latitud:parameters.latitud, 
        longitud:parameters.longitud
    }];

    communityModel.findById(parameters.idcom, (_err, comunityfind) => {
        console.log(comunityfind);
        //LADO IZQUIERDO ES DE LOS CAMPOS DE PUBLICACION Y LADO DERECHO COMUNIDAD
        evento_model.communityId = comunityfind._id
        evento_model.communityName = comunityfind.nameCommunity
    })

    if (req.files?.image) {
        const result = await UploadImg(req.files.image.tempFilePath);
        evento_model.imagen.public_id = result.public_id;
        evento_model.imagen.secure_url = result.secure_url;
    }


    if (req.files?.video) {
        const result = await UploadVideo(req.files.image.tempFilePath);
        evento_model.video.public_id = result.public_id;
        evento_model.video.secure_url = result.secure_url;
    }




    evento_model.save((err, post_save) => {
        if (err) {
            return res.status(500).send({ message: 'err en la peticion' });
        }

        // si la repuesta de la base de datos nos regresa "null"
        if (!post_save) {
            return res
                .status(500)
                .send({ message: 'err al guardar el usuario' });
        }

        return res.status(200).send({ message: post_save })
    })

}






//exportar los modulos
module.exports = {
    crear_evento,
    eliminar_evento,
    buscar_evento,
    buscar_evento_id,
    editar_evento
};