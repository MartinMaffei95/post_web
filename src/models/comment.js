const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // comment_id: { type: mongoose.Types.ObjectId },
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
  replieTo: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true,
  },
  likes: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // a blog post can have multiple comments, so it should be in a array.
  // all comments info should be kept in this array of this blog post.
  replies: { type: Array },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
