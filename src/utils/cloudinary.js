const cloudinary = require('cloudinary').v2;
const { CLOUD_NAME, API_KEY, API_SECRET_KEY } = require('../../configs/config');

cloudinary.config({
	cloud_name: CLOUD_NAME,
	api_key: API_KEY,
	api_secret: API_SECRET_KEY,
	secure: true
});

async function UploadImg(filePath) {
	return await cloudinary.uploader.upload(filePath, {
		folder: 'replit'
	});
}

module.exports = {
	UploadImg
};
