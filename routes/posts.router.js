const router = require("express").Router();
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");

router.get("/create", (req, res) => {
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

router.post("/create", (req, res) => {
  const { title, author } = req.body;
});

module.exports = router;
