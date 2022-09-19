const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPost,
  createPost,
  likePost,
  unlikePost,
  createComment,
  editPost,
  deletePost,
} = require('../controllers/posts');
const { verifyToken } = require('../middlewares/verifyToken');
const { verifyID } = require('../middlewares/verifyID');

//getAllPosts
router.get('/all', verifyToken, getAllPosts);

//Getting a specific post
router.get('/:id', verifyToken, verifyID, getPost);

//Create a new post
router.post('/', verifyToken, createPost);

// Make a comment in a post
router.post('/:id', verifyToken, verifyID, createPost);

// Like a post
router.post('/:id/like_post', verifyToken, verifyID, likePost); // :id = post id, in body send user id

// Unlike a post
router.post('/:id/unlike_post', verifyToken, verifyID, unlikePost);

// Make a comment in a post
router.post('/:id/make_comment', verifyToken, verifyID, createComment);

//modify post
router.put('/:id', verifyToken, verifyID, editPost);

//Delete post
router.delete('/:id', verifyToken, verifyID, deletePost);

module.exports = router;
