const router = require("express").Router();
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Comment = require("../models/Comments.model");
const Post = require("../models/Posts.model");
const compareIds = require("../utils/CompareIds");

router.get("/create", isLoggedIn, (req, res) => {
  const expressions = [
    "What's in your head?",
    "Got a lot on your mind?",
    "Get something off your chest...",
    "Speak your mind!",
    "Say something!",
    "With great power...",
    "...",
    "Nothing to say?",
  ];
  const randomExpression =
    expressions[Math.floor(Math.random() * expressions.length)];

  res.render("posts/create-post", { randomExpression });
});

//createPost
router.post("/create", isLoggedIn, (req, res) => {
  const { title, post } = req.body;

  Post.create({
    title,
    post,
    author: req.session.user._id,
  }).then((createdPost) => {
    console.log(createdPost);
    res.redirect("/");
  });
});

function findPostId(req, res, next) {
  Post.findById(req.params.id)
    .populate("author")
    .then((singlePost) => {
      if (!singlePost) {
        return res.redirect("/");
      }

      req.post = singlePost;

      next();
    });
}

router.get("/:id", findPostId, (req, res) => {
  let isAuthor = false;
  if (req.session.user) {
    if (compareIds(req.session.user._id, req.post.author._id)) {
      isAuthor = true;
    }
    return res.render("posts/post", { post: req.post, isAuthor });
  }
});

router.get("/:id/edit", isLoggedIn, findPostId, (req, res) => {
  if (!compareIds(req.session.user._id, req.post.author._id)) {
    return res.redirect(`/posts/${req.params.id}`);
  }
  res.render("posts/edit-single-post", { post: req.post });
});

router.post("/:id/edit", isLoggedIn, findPostId, (req, res) => {
  const { title, post } = req.body;

  if (!compareIds(req.session.user._id, req.post.author._id)) {
    return res.redirect(`/posts/${req.post._id}`);
  }

  return Post.findByIdAndUpdate(req.post._id, { title, post }).then(() => {
    res.redirect(`/posts/${req.post._id}`);
  });
});

router.get("/:id/delete", isLoggedIn, findPostId, async (req, res) => {
  const isAuthor = compareIds(req.session.user._id, req.post.author._id);

  if (!isAuthor) {
    return res.redirect(`/posts/${req.params.id}`);
  }

  // await Comment.deleteMany({ post: {$in: [req.post._id] } });
  await Post.findByIdAndDelete(req.post._id);

  res.redirect("/");
});

module.exports = router;
