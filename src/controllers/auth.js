const bcrypt = require('bcrypt');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'key'; // private key for jsonWebToken

const login = (req, res) => {
  Profile.findOne({ username: req.body.username }, (err, result) => {
    if (err) {
      res.send('Error en el login ' + err);
    } else {
      if (result) {
        if (
          req.body.password &&
          bcrypt.compareSync(req.body.password, result.password)
        ) {
          //User logged!
          //now
          //Creating Token with jsw
          jwt.sign({ user: result }, SECRET_KEY, (err, token) => {
            res.status(200).send({
              message: 'LOGIN_SUCCESS',
              user: result,
              token: token,
            });
          });
        } else {
          res.status(400).send({
            message: 'IVALID_PASSWORD',
            error: err,
          });
        }
      } else {
        res.status(400).send({
          message: 'IVALID_USER',
          error: err,
        });
      }
    }
  });
};
const register = (req, res) => {
  const api = `https://avatars.dicebear.com/api/pixel-art/1255`;
  //encripting the password with BCRYPT and create USER
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      console.log('BCRYPT ERROR:', 'PASS send on BODY', req.body.password, err);
      return res.status(400).send({
        message: 'BAD_REQUEST',
        error: err,
      });
    }
    const user = new Profile({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      image: `${api}${Math.round(Math.random() * 1000)}.svg`,
    });

    user.save((err, result) => {
      if (err) {
        res.status(500).send({
          message: 'ERROR_LOGIN',
          errors: err.errors,
        });
      } else {
        res.status(201).send({
          message: 'USER_CREATED',
          user: result,
        });
        console.log(result);
      }
    });
  });
};

module.exports = {
  login,
  register,
};
