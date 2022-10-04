const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  // _id: { type: mongoose.Types.ObjectId, ref: 'Profile' },
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
  name: { type: String },
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
  birthdate: { type: Number },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
  },
  biography: { type: String },
  image: {
    type: String,
    required: false,
  },
  filters: {
    blockedPost: {
      type: String,
      trim: true,
    },
    blockedUsers: {
      type: String,
      trim: true,
    },
  },
  favoritePosts: {
    type: Array,
  },
  followers: { type: mongoose.Types.ObjectId },
  follow: { type: mongoose.Types.ObjectId },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;
