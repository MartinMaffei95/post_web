const express = require('express');
const router = express.Router();
const { getPostsWithProfile } = require('../controllers/posts');
const { getProfile } = require('../controllers/profiles');
const { verifyToken } = require('../middlewares/verifyToken');

//get all Users
router.get('/', (req, res) => {
  res.send('TODOS LOS MENSAJES');
});

//get my user
router.get('/me', (req, res) => {
  res.send('My Profile');
});

//Getting a specific profile
router.get('/:id', verifyToken, getProfile);

//Getting a specific profile POSTS
router.get('/:id/posts', verifyToken, getPostsWithProfile);

//modify a profile
router.patch('/:id', (req, res) => {
  res.send(`MENSAJE : ${req.params.id}`);
});

module.exports = router;
