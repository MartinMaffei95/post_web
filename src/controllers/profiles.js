const jwt = require('jsonwebtoken');
const Profile = require('../models/profile');
const Post = require('../models/posts');
const { isValidID, isValidDate } = require('./utils');
const SECRET_KEY = process.env.SECRET_KEY; // private key for jsonWebToken

// // Get my user Profile
// const getUserMyUser = (req, res) => {
//   jwt.verify(req.token, SECRET_KEY, (err, profileData) => {
//     if (err) {
//       res.send('error durante el inicio de sesion');
//     } else {
//       res.status(200).json({
//         message: 'USER_FIND',
//         profileData: profileData,
//       });
//     }
//   });
// };

// get scpecific profile
const getProfile = (req, res) => {
  let profileID = req.params.id;
  if (!isValidID(profileID)) {
    return res.status(401).json({
      message: 'INVALID_ID',
    });
  }
  jwt.verify(req.token, SECRET_KEY, async (err, userData) => {
    if (err) {
      res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      const profileData = await Profile.findById(profileID); // Getting the profile
      console.log(profileData);
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

// edit profile
const editProfile = (req, res) => {
  let profileID = req.params.id;

  if (!isValidID(profileID)) {
    return res.status(401).json({
      message: 'INVALID_ID',
    });
  }
  jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
    if (err) {
      return res.status(401).json({
        message: 'INVALID_TOKEN',
      });
    } else {
      // name and image is requiredc
      const { name, username, birthdate, location, biography, image } =
        req.body;

      if (!name) {
        return res.status(401).json({
          message: 'INVALID_NAME',
        });
      }
      if (!username) {
        return res.status(401).json({
          message: 'INVALID_USERNAME',
        });
      }
      if (!image) {
        return res.status(401).json({
          message: 'INVALID_IMAGE',
        });
      }
      if (!isValidDate(birthdate)) {
        return res.status(401).json({
          message: 'INVALID_DATE_FORMAT',
        });
      }

      let profileData = await Profile.findByIdAndUpdate(
        profileID,
        {
          name: name,
          username: username,
          birthdate: birthdate,
          location: location,
          biography: biography,
          image: image,
          updatedAt: Date.now(),
        },
        {
          returnOriginal: false,
        }
      ); // Getting the post for Id (postID) and change text
      if (profileData !== null) {
        res.status(201).json({
          message: 'PROFILE_MODIFIED',
          profile: profileData,
        });
      } else {
        res.status(404).json({
          message: 'PROFILE_ERROR',
        });
      }

      // if (profileData !== null) {
      //   res.status(200).json({
      //     message: 'PROFILE_FOUND',
      //     profileData: profileData,
      //     posts: postByAuthorID,
      //   });
      // } else {
      //   res.status(404).json({
      //     message: 'PROFILE_NOT_FOUND',
      //   });
      // }
    }
  });
};

module.exports = {
  getProfile,
  editProfile,
};
