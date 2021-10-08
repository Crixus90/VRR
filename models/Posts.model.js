const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    likes: {
      type: Number,
      ref: "User",
    },
    title: String,
    post: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    hashtag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
