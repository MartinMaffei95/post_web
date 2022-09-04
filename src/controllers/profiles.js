const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const Post = require('../models/posts');

const SECRET_KEY = 'key'; // private key for jsonWebToken

// Get my user Profile
const getUserMyUser = (req, res) => {
  jwt.verify(req.token, SECRET_KEY, (err, profileData) => {
    if (err) {
      res.send('error durante el inicio de sesion');
    } else {
      res.status(200).json({
        message: 'USER_FIND',
        profileData: profileData,
      });
    }
  });
};

// get scpecific profile
const getProfile = (req, res) => {
  let profileID = req.params.id;

  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      if (!profileID) return ras.send('ERRRRRRRRRRRRRORRRRRR');
      const profileData = await Profile.findById(profileID); // Getting the profile
      const postByAuthorID = await Post.find({
        'author.userID': profileID,
      }) // Getting all posts
        // Sorting by last updated
        .sort({ updatedAt: -1 });
      //Adding pagination .. TODO: Use later for other petitions.. (plugin 'Mongose-pagination' ??)
      // .skip(5)
      // .limit(5);
      if (profileData !== null) {
        res.status(200).json({
          message: 'PROFILE_FOUND',
          profileData: profileData,
          posts: postByAuthorID,
        });
      } else {
        res.status(404).json({
          message: 'PROFILE_NOT_FOUND',
        });
      }
    }
  });
};

module.exports = {
  getProfile,
};
