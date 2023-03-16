/* eslint-disable no-unused-vars */
const PostC = require('../../models/post/postTypeC.model');
const Community = require('../../models/community.model');
const { UploadImg } = require('../../utils/cloudinary');

// publicacion normal sin tickets
async function createPostC (req, res) {
	const modelPostTypeC = new PostC();
	const parameters = req.body;
	const { idCommunity } = req.params;

	const community = await Community.findById(idCommunity);

	if (req.files?.image) {
		const result = await UploadImg(req.files.imagen.tempFilePath);
		console.log(result);
		modelPostTypeC.imagenPostTypeC.public_id = result.public_id;
		modelPostTypeC.imagenPostTypeC.secure_url = result.secure_url;
	}

	// modelPostTypeC.save((err, saveModel) => {
	//     if (err) {
	//         return res.status}
	//     }
	// })
}
