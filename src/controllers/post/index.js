const createPost = require('./createPost');
const editPost = require('./editPost')
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
const { addLike, removeLike } = require('./likes');
const reactPost = require('./react');

module.exports = {
  createPost,
  editPost,
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
  addLike,
  removeLike,
  getCommentsPost,
  deleteComment,
  reactPost,
};
