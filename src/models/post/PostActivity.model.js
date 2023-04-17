const mongoose = require('mongoose');
const { Schema } = mongoose;



//Publicacion normal
const PostActivitySchema = new Schema({
	communityId: { type: String, require: true },
	communityName: { type: String, require: true },
	titulo: { type: String, required: true },
	desc: { type: String, default: '' },
	imagen: {
		public_id: { type: String, default: '', },
		secure_url: { type: String, default: '' }
	},
	video: { type: String, default: '' },
	tipoPublicacion: { type: String, required: true },
	likes: { type: Array, default: [] },
	comments: { type: Array, default: [] },


}, { timestamps: true });



const PostActivity = mongoose.model('PostActivities', PostActivitySchema);


module.exports =  PostActivity ;
