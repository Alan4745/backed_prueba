const {	evento_tickets}= require('./../../models/post/PostEvent_Tickets');
const communityModel = require('./../../models/community.model');
const { UploadImg, UploadVideo } = require('../../utils/cloudinary');

async function buscar_evento_ticket(req, res) {
    evento_tickets.find({ communityId: req.params.id }, (err, find_evento_ticket) => {
        return res.status(200).send({ message: find_evento_ticket })
    })
}
//BUSCAR EVENTO POR ID DEL EVENTO
async function buscar_evento_ticket_id(req, res) {
    evento_tickets.findOne({ _id: req.params.evento_id }, (err, find_evento_ticket_id) => {
        return res.status(200).send({ message: find_evento_ticket_id })
    })
}


async function editar_evento_ticket(req, res) {
    console.log(req.params.evento_ticket_id + 'estamos aqui');
    evento_tickets.findByIdAndUpdate(req.params.evento_ticket_id, {titulo: req.body.titulo, desc: req.body.desc}, {new: true},(err, update_evento_ticket) => {
        return res.status(200).send({ message: update_evento_ticket })
    })
}






async function eliminar_evento_tickets(req, res) {
    evento_tickets.findByIdAndDelete({ _id: req.params.id_evento }, (err, eliminar_evento_ticket) => {
        return res.status(200).send({ message: eliminar_evento_ticket })
    })
}


//creando evento con tickets 
async function crear_evento_ticket(req, res){
evento_ticket_model= new evento_tickets();
const parameters= req.body;


evento_ticket_model.titulo = parameters.titulo;
evento_ticket_model.desc = parameters.descripcion;
evento_ticket_model.tipoPublicacion = "evento_tickets";
evento_ticket_model.ubicacion=[{
    latitud:parameters.latitud, 
    longitud:parameters.longitud
}];
communityModel.findById(parameters.idcom, (_err, comunityfind) => {
    console.log(comunityfind);
    //LADO IZQUIERDO ES DE LOS CAMPOS DE PUBLICACION Y LADO DERECHO COMUNIDAD
    evento_ticket_model.communityId = comunityfind._id
    evento_ticket_model.communityName = comunityfind.nameCommunity
})

if (req.files?.image) {
    const result = await UploadImg(req.files.image.tempFilePath);
    evento_ticket_model.imagen.public_id = result.public_id;
    evento_ticket_model.imagen.secure_url = result.secure_url;
}


if (req.files?.video) {
    const result = await UploadVideo(req.files.image.tempFilePath);
    evento_ticket_model.video.public_id = result.public_id;
    evento_ticket_model.video.secure_url = result.secure_url;
}


evento_ticket_model.save((err, event_ticket) => {
    if (err) {
        return res.status(500).send({ message: 'err en la peticion' });
    }

    // si la repuesta de la base de datos nos regresa "null"
    if (!event_ticket) {
        return res
            .status(500)
            .send({ message: 'err al guardar el usuario' });
    }

    return res.status(200).send({ message: event_ticket })
})
}




//exportar los modulos
module.exports = {
   crear_evento_ticket,
   eliminar_evento_tickets,
   buscar_evento_ticket,
   buscar_evento_ticket_id,
   editar_evento_ticket
};