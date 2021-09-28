const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    header: {
      type: String,
      required: true,
    },
    text: String,
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

const Article = mongoose.model("Article", postSchema);

module.exports = Article;
