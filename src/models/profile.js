const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  username: {
    type: String,
    validate: {
      validator: function (username) {
        return mongoose
          .model('Profile')
          .findOne({ username: username })
          .then((user) => !user);
      },
      message: 'TAKEN_USERNAME',
    },
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: [true, 'PASSWORD is required'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'INVALID_MAIL'],
    validate: {
      validator: function (email) {
        return mongoose
          .model('Profile')
          .findOne({ email: email })
          .then((user) => !user);
      },
      message: 'TAKEN_MAIL',
    },
  },
  password: {
    type: String,
    required: [true, 'PASSWORD is required'],
  },
  image: {
    type: String,
    required: false,
  },
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
