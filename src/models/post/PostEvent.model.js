const mongoose = require('mongoose');

const { Schema } = mongoose;

const PostTypeASchema = new Schema({
	communityId: {
		type: String,
	},
	communityName: {
		type: String,
	}, 
	titulo: {
		type: String,
		require: true
	}, 
	desc: {
		type: String,
		max: true,
	},
	imagen: {
		public_id: {
			type: String,
			default: '',
		}, 
		secure_url: {
			type: String,
			default: ''
		}
	},
	video:{
		public_id: { type: String, default: '', },
		secure_url: { type: String, default: '' }
	},
	
	likes: {
		type: Array, 
		default: [],
	}, 
	comentarios: {
		type: Array, 
		default: [],
	},
	tipoPublicacion: {
		type: String,
		default: ''
	},
	ubicacion:{
		type: Array,
		default:[]
	}
});
const Post_evento= mongoose.model('evento_post', PostTypeASchema);

module.exports ={
	Post_evento
}