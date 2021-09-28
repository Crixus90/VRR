const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: String,
    comments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", postSchema);

module.exports = Comment;
