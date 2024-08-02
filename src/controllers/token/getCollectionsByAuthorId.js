/* eslint-disable no-unused-vars */
// const crypto = require("crypto");
// const TokenCollection = require("../../models/tokens/tokenCollection.model");
const Collections = require("../../models/tokens/collections.model");
// const Token = require("../../models/tokens/tokenUnitary.model");
// const fs = require("fs-extra");
// const User = require("../../models/user.model");
// const io = require("../../../Server");

// const { UploadImg } = require("../../utils/cloudinary");
// const { default: mongoose } = require("mongoose");

const getCollectionsByAuthorId = async (req, res) => { 
    const { authorId } = req.params;
  
    try {
      const collections = await Collections.find({ author: authorId });
  
      if (!collections) {
        return res
          .status(404)
          .json({ message: "No collections found for this author" });
      }
  
      res.status(200).json({ message: collections });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getCollectionsByAuthorId }