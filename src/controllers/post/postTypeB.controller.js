/* eslint-disable no-unused-vars */
const PostB = require('../../models/post/postTypeB.model');
const Community = require('../../models/community.model');
const { UploadImg } = require('../../utils/cloudinary');

// publicaion con tokens
async function createPostTypeB (req, res) {
	const modelPostTypeB = new PostB();
	const parameters = req.body;
	const { idCommunity } = req.params;

	const community = await Community.findById(idCommunity);

	if (req.files?.image) {
		const result = await UploadImg(req.files.imagen.tempFilePath);
		console.log(result);
		modelPostTypeB.imagenPostTypeB.public_id = result.public_id;
		modelPostTypeB.imagenPostTypeB.secure_url = result.secure_url;
	}

	modelPostTypeB.communityId = community._id;
	modelPostTypeB.communityName = community.nameCommunity;
	modelPostTypeB.title = parameters.title;
	modelPostTypeB.desc = parameters.desc;
	modelPostTypeB.likes = [];
	modelPostTypeB.collection = [];
	modelPostTypeB.typePost;
}

module.exports = {
	createPostTypeB
};
