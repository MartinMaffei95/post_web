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

//getAllPosts
router.get('/all', verifyToken, getAllPosts);

//Getting a specific post
router.get('/:id', verifyToken, getPost);

//Create a new post
router.post('/', verifyToken, createPost);

// Make a comment in a post
router.post('/:id/', verifyToken, createPost);

// Like a post
router.post('/:id/like_post', verifyToken, likePost); // :id = post id, in body send user id

// Unlike a post
router.post('/:id/unlike_post', verifyToken, unlikePost);

// Make a comment in a post
router.post('/:id/make_comment', verifyToken, createComment);

//modify post
router.put('/:id', verifyToken, editPost);

//Delete post
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
