const router = require("express").Router();
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

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

//change password

router.get("/update-password", isLoggedIn, (req, res) => {
  res.render("profile/update-password");
});

router.post("/update-password", isLoggedIn, (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    res.render("profile/update-password", {
      errorMessage: "New password cannot be the same",
    });
    return;
  }

  User.findById(req.session.user._id).then((user) => {
    const arePasswordsTheSame = bcrypt.compareSync(oldPassword, user.password);

    if (!arePasswordsTheSame) {
      return res.render("profile/update-password", {
        errorMessage: "Wrong credentials",
      });
    }

    if (newPassword.length < 8 || !/\d/g.test(newPassword)) {
      return res.render("profile/update-password", {
        errorMessage:
          "New password must contain 8 characters and at least 1 number",
      });
    }

    const saltRounds = 10;

    const salt = bcrypt.genSaltSync(saltRounds);

    const hashPassword = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    ).then((updatedUser) => {
      req.session.user = updatedUser;
      res.redirect("/");
    });
  });
});

//delete

router.get("/delete-account", isLoggedIn, async (req, res) => {
  const userId = req.session.user._id;

  await User.findByIdAndDelete(userId);

  req.session.destroy((err) => {
    if (err) {
      console.error("err: ", err);
    }

    res.redirect("/");
  });
});

module.exports = router;
