// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();
const Post = require("./models/Posts.model");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const projectName = "VRBlog";
const capitalized = (string) =>
  string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)} created with IronLauncher`;

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  }
  next();
});

// 👇 Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const authRoutes = require("./routes/auth.router");
app.use("/auth", authRoutes);

const profileRouter = require("./routes/profile.router");
app.use("/profile", profileRouter);

const postRouter = require("./routes/posts.router");
app.use("/posts", postRouter);

const contactRouter = require("./routes/contact.router");
app.use("/contact", contactRouter);

app.get("/likes/:postId", async (req, res) => {
  console.log(req.session);

  // if you return a "false" --> not logged in, or not a real post, your response will still be considered "correctt"
  // check if user is logged in
  // // check if the post exists
  // after checking if post exists, you can check if user already has a like
  // if the user has, you can remove the like eventually
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.postId,
    {
      $addToSet: { likes: req.session.user._id },
    },
    {
      new: true,
    }
  );
  res.json(updatedPost);
});

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
