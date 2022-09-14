const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // _id: {
  //   type: mongoose.Types.ObjectId,
  // },
  text: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    username: {
      type: String,
      trim: true,
      required: true,
    },
    userID: {
      type: String,
      trim: true,
      required: true,
    },
  },
  likes: {
    type: Array,
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: Date.now,
  },
  // a blog post can have multiple comments, so it should be in a array.
  // all comments info should be kept in this array of this blog post.
  comments: {
    type: Array,
  },
  isReply: {
    type: Boolean,
  },
  replyTo: {
    type: mongoose.Types.ObjectId,
  },
  repliesLength: { type: Number },
});

postSchema.virtual('url').get(function () {
  return '/post/' + this._id;
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
