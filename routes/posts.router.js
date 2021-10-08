const router = require("express").Router();
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const Comment = require("../models/Comments.model");
const Post = require("../models/Posts.model");

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate("author")
    .then((thePost) => {
      res.render("posts/post", { post: thePost });
    });
});

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

router.post("/create", isLoggedIn, (req, res) => {
  const { title, post } = req.body;

  Post.create({
    title,
    post,
    author: req.session.user._id,
  })
    .then((createdPost) => {
      console.log(createdPost);
      res.redirect("/");
    })
    .catch();
});

module.exports = router;
