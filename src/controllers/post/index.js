const createPost = require('./createPost');
const { getAllPosts, 
        getFeedPosts, 
        getPostFollowing, 
        getPost, 
        getPostByUser, 
        getPublicPost } = require('./getPosts');
const updatePost = require('./updatePost');
const deletePost = require('./deletePost');
const sharePost = require('./sharePost');
const { addComment, 
        deleteComment, 
        getCommentsPost } = require('./comments');
const reactPost = require('./react');

module.exports = {
  createPost,
  getAllPosts,
  getFeedPosts,
  getPostFollowing,
  getPost,
  getPostByUser,
  getPublicPost,
  updatePost,
  deletePost,
  sharePost,
  addComment,
  getCommentsPost,
  deleteComment,
  reactPost,
};
