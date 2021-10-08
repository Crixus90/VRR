const router = require("express").Router();
const Post = require("../models/Posts.model");

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find().then((allPosts) => {
    res.render("index", { allPosts });
  });
});

module.exports = router;
