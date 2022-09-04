const verifyToken = (req, res, next) => {
  console.log('Accediendo a Middleware');
  const autorization_header = req.headers['authorization'];
  if (autorization_header !== undefined) {
    const token = autorization_header.split(' ')[1];
    req.token = token;
    next();
  } else {
    res.status(401).json({
      message: 'TOKEN_NOT_FOUND',
    });
  }
};

// const tokenRequest = (cb)=>{ // need callback function for execute in case of the token request = good
// jwt.verify(req.token, SECRET_KEY, async (err, postData) => {
//   if (err) {
//     res.status(401).json({
//       message: 'INVALID_TOKEN',
//     });
//   } else {
//     cb()
//     const allPosts = await Post.find({}); // Getting all posts
//     if (allPosts !== null) {
//       res.status(200).json({
//         message: 'POST_FOUND',
//         post: allPosts,
//       });
//     } else {
//       res.status(404).json({
//         message: 'POST_NOT_FOUND',
//       });
//     }
//   }
// });
// }

exports.verifyToken = verifyToken;
