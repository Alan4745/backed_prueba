const cloudinary = require("cloudinary").v2;
const { CLOUD_NAME, API_KEY, API_SECRET_KEY } = require("../../configs/config");

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET_KEY,
  secure: true,
});

async function UploadImg(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "replit",
  });
}

async function UploadVideo(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "video",
    resource_type: "video",
  });
}

async function UploadAudio(filePath) {
  return await cloudinary.uploader.upload(filePath, {
    folder: "audio",
    resource_type: "video", // Cloudinary usa "video" para manejar archivos de audio también
  });
}

module.exports = {
  UploadImg,
  UploadVideo,
  UploadAudio,
};
