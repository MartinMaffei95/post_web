const Post = require('../models/posts');
const { isValidID } = require('./utils');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Comment = require('../models/comment');
const { findById } = require('../models/posts');
const SECRET_KEY = 'key'; // private key for jsonWebToken

// get all posts
const getAllPosts = async (req, res) => {
  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      const allPosts = await Post.find({ isReply: false }) // Getting all posts
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
  if (!postID) {
    return res.status(401).json({
      message: 'NEED_POST_ID',
    });
  } else {
    jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
      if (err) {
        res.status(401).json({
          message: 'INVALID_TOKEN',
        });
      } else {
        const post = await Post.findById(postID); // Getting the post
        const replies = await Post.find({ replyTo: postID }); // Getting comments
        if (post !== null) {
          return res.status(200).json({
            message: 'POST_FOUND',
            post: post,
            comments: replies,
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

// get posts with a specific profile
const getPostsWithProfile = async (req, res) => {
  let profileID = req.params.id;
  if (!profileID) {
    return res.status(401).json({
      message: 'INVALID_ID',
    });
  } else {
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
  }
};

//Create a new post
const createPost = (req, res) => {
  const postID = req.params.id;
  const { author, text, isReply } = req.body;
  // ## its a post
  if (!postID) {
    const post = new Post({
      // title: req.body.title,
      text: text,
      author: {
        username: author.username,
        userID: author.userID,
      },
      isReply: false,
    });
    post.save((err, result) => {
      if (err) {
        return res.send('No se creo el post : ' + err);
      } else {
        return res.send('Post creado!!');
      }
    });
  }
  // ## its a comment
  if (postID) {
    //## validate  Id
    if (!isValidID(postID)) {
      return res.status(404).json({
        message: 'Error en el id',
      });
    }

    if (!postID || postID === '') {
      return res.status(401).json({
        message: 'NEED_POST_ID',
      });
    }
    if (!author.userID || author.userID == '') {
      return res.status(401).json({
        message: 'NEED_USER_ID',
      });
    }
    if (!author.username || author.username == '') {
      return res.status(401).json({
        message: 'NEED_USERNAME',
      });
    }
    if (!text || text == '') {
      return res.status(401).json({
        message: 'COMMENT_EMPTY',
      });
    }

    // Primero crear el post(comentario) y luego editar el post al que estamos comentando y sumarle 1 en repliesLength
    const post = new Post({
      text: text,
      author: {
        username: author.username,
        userID: author.userID,
      },
      isReply: true,
      replyTo: postID,
      repliesLength: 0,
    });
    post.save(async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'SERVER_ERROR',
          error: err,
        });
      } else {
        const postReply = await Post.findByIdAndUpdate(postID, {
          $inc: { repliesLength: 1 },
          returnOriginal: true,
        });

        return res.status(200).json({
          message: 'POST_CREATED',
          post: post,
        });
      }
    });
  }
};

// Like a post
const likePost = (req, res) => {
  let postID = req.params.id;
  let userID = req.body.id;

  if (!userID) {
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
          if (post.likes.includes(userID)) {
            res.status(401).json({
              message: 'LIKE_ALREDY_EXIST',
              post: post,
            });
          } else {
            post.likes.push(userID);
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
  let userID = req.body.id;

  if (!userID) {
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
          const likes = post.likes.filter((user) => user !== userID);
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
  const { userID, username, text } = req.body;

  if (!isValidID(postID)) {
    return res.status(404).json({
      message: 'Error.',
    });
  }

  if (!postID || postID === '') {
    return res.status(401).json({
      message: 'NEED_POST_ID',
    });
  }
  if (!userID || userID == '') {
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

  const comment = new Comment({
    replieTo: postID,
    // comment_id: mongoose.Types.ObjectId(''),
    text: text,
    author: {
      userID: userID,
      username: username,
    },
  });
  comment.save();

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
        return res.status(201).json({
          message: 'COMMENT_ADDED',
          post: post,
        });
      } else {
        let replie = await Comment.findByIdAndUpdate(
          postID,
          { $push: { replies: comment } },
          {
            returnOriginal: false,
          }
        );
        if (replie !== null) {
          return res.status(201).json({
            message: 'COMMENT_ADDED',
            post: replie,
          });
        }
        res.status(404).json({
          message: 'POST_NOT_FOUND',
        });
      }
    }
  });
};

//Make a replie
const createReplie = (req, res) => {
  let commentID = req.params.id;
  const { userID, username, text } = req.body;

  if (!isValidID(commentID)) {
    return res.status(404).json({
      message: 'Error.',
    });
  }

  if (!commentID || commentID === '') {
    return res.status(401).json({
      message: 'NEED_COMMENT_ID',
    });
  }
  if (!userID || userID == '') {
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

  // const comment = new Comment({
  //   replieTo: commentID,
  //   // comment_id: mongoose.Types.ObjectId(''),
  //   text: text,
  //   author: {
  //     userID: userID,
  //     username: username,
  //   },
  // });
  // comment.save();

  jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      // #################################################################
      let comment = await Comment.findByIdAndUpdate(
        commentID,
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
