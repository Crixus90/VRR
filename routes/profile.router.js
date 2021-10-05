const router = require("express").Router();
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");

router.get("/my-profile", isLoggedIn, (req, res) => {
  res.render("profile/my-profile");
});

//update profile

router.get("/update-profile", isLoggedIn, (req, res) => {
  res.render("profile/update-profile");
});

router.post("/update-profile", isLoggedIn, (req, res) => {
  const { username, email, headset, bio } = req.body;

  if (!username || !email) {
    res.render("profile/update-profile", {
      errorMessage: "Please fill in the required fields",
      ...req.body,
    });
    return;
  }

  User.findOne({ email }).then((foundCredentials) => {
    if (foundCredentials) {
      res.render("profile/update-profile", {
        errorMessage: "Email already exists",
        ...req.body,
      });
      return;
    }
    User.findOne({ username }).then((foundCredentials) => {
      if (foundCredentials) {
        res.render("profile/update-profile", {
          errorMessage: "Username already exists",
          ...req.body,
        });
        return;
      }

      User.findByIdAndUpdate(
        req.session.user._id,
        { username, email, headset, bio },
        { new: true }
      ).then((updatedUser) => {
        req.session.user = updatedUser;
        res.redirect("/profile/my-profile");
      });
    });
  });
});

module.exports = router;
