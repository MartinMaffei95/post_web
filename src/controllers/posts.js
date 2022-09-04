const Post = require('../models/posts');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const SECRET_KEY = 'key'; // private key for jsonWebToken

// get all posts
const getAllPosts = async (req, res) => {
  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      const allPosts = await Post.find({}) // Getting all posts
        // Sorting by last updated
        .sort({ updatedAt: -1 });
      //Adding pagination .. TODO: Use later for other petitions.. (plugin 'Mongose-pagination' ??)
      // .skip(5)
      // .limit(5);
      if (allPosts !== null) {
        res.status(200).json({
          message: 'POST_FOUND',
          post: allPosts,
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

// get scpecific post
const getPost = (req, res) => {
  let postID = req.params.id;
  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      const post = await Post.findById(postID); // Getting the post
      if (post !== null) {
        res.status(200).json({
          message: 'POST_FOUND',
          post: post,
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

// get posts with a specific profile
const getPostsWithProfile = async (req, res) => {
  let profileID = req.params.id;
  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      const postByAuthorID = await Post.find({
        'author.userID': profileID,
      }) // Getting all posts
        // Sorting by last updated
        .sort({ updatedAt: -1 });
      //Adding pagination .. TODO: Use later for other petitions.. (plugin 'Mongose-pagination' ??)
      // .skip(5)
      // .limit(5);
      if (postByAuthorID !== null) {
        res.status(200).json({
          message: 'POST_FOUND',
          post: postByAuthorID,
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

//Create a new post
const createPost = (req, res) => {
  const post = new Post({
    // title: req.body.title,
    text: req.body.text,
    author: {
      username: req.body.author.username,
      userID: req.body.author.userID,
    },
  });
  post.save((err, result) => {
    if (err) {
      res.send('No se creo el post : ' + err);
    } else {
      res.send('Poste creado!!');
      console.log(result);
    }
  });
};

// Like a post
const likePost = (req, res) => {
  let postID = req.params.id;
  let userId = req.body.id;

  if (!userId) {
    res.status(401).json({
      message: 'NEED_USER_ID',
    });
  } else {
    jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
      if (err) {
        res.status(401).json({
          message: 'INVALID_TOKEN',
        });
      } else {
        // #################################################################
        let post = await Post.findById(postID);
        if (post !== null) {
          if (post.likes.includes(userId)) {
            res.status(401).json({
              message: 'LIKE_ALREDY_EXIST',
              post: post,
            });
          } else {
            post.likes.push(userId);
            post.save();
            res.status(201).json({
              message: 'LIKE_ADDED',
              post: post,
            });
          }
        } else {
          res.status(404).json({
            message: 'POST_NOT_FOUND',
          });
        }
      }
    });
  }
};

// Unike a post
const unlikePost = (req, res) => {
  let postID = req.params.id;
  let userId = req.body.id;

  if (!userId) {
    res.status(401).json({
      message: 'NEED_USER_ID',
    });
  } else {
    jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
      if (err) {
        res.status(401).json({
          message: 'INVALID_TOKEN',
        });
      } else {
        // #################################################################
        let post = await Post.findById(postID);
        if (post !== null) {
          const likes = post.likes.filter((user) => user !== userId);
          post.likes = likes;
          post.save();
          res.status(201).json({
            message: 'LIKE_DELETED',
            post: post,
          });
        } else {
          res.status(404).json({
            message: 'POST_NOT_FOUND',
          });
        }
      }
    });
  }
};

// Make a comment
const createComment = (req, res) => {
  let postID = req.params.id;

  const { userId, username, text } = req.body;
  const comment = {
    post_id: postID,
    comment_id: new mongoose.Types.ObjectId(),
    text: text,
    author: {
      userId: userId,
      username: username,
    },
  };
  if (!postID || postID === '') {
    return res.status(401).json({
      message: 'NEED_POST_ID',
    });
  }
  if (!userId || userId == '') {
    return res.status(401).json({
      message: 'NEED_USER_ID',
    });
  }
  if (!username || username == '') {
    return res.status(401).json({
      message: 'NEED_USERNAME',
    });
  }
  if (!text || text == '') {
    return res.status(401).json({
      message: 'COMMENT_EMPTY',
    });
  }

  jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      // #################################################################
      let post = await Post.findByIdAndUpdate(
        postID,
        { $push: { comments: comment } },
        {
          returnOriginal: false,
        }
      );
      if (post !== null) {
        res.status(201).json({
          message: 'COMMENT_ADDED',
          post: post,
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

//Edit a post
const editPost = (req, res) => {
  let postID = req.params.id;
  let newText = req.body.text;

  jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      let post = await Post.findByIdAndUpdate(
        postID,
        { text: newText, updatedAt: new Date() },
        {
          returnOriginal: false,
        }
      ); // Getting the post for Id (postID) and change text
      if (post !== null) {
        console.log(post);
        res.status(201).json({
          message: 'POST_FOUND',
          post: post,
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

//Delete a post // Need same Id bteween post and profile
const deletePost = (req, res) => {
  let postID = req.params.id;

  jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      let post = await Post.findByIdAndDelete(postID); // Getting the post for Id (postID) and change text
      if (post !== null) {
        res.status(200).json({
          message: 'POST_DELETED',
        });
      } else {
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

module.exports = {
  getAllPosts,
  getPostsWithProfile,
  getPost,
  createPost,
  likePost,
  unlikePost,
  createComment,
  editPost,
  deletePost,
};
