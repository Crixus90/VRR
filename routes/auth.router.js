const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const isNotLoggedIn = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

//signup
router.get("/signup", isNotLoggedIn, (req, res) => {
  res.render("auth/signup");
});
router.post("/signup", isNotLoggedIn, (req, res) => {
  const { username, email, password, headset } = req.body;

  if (!username || !email) {
    res.render("auth/signup", {
      errorMessage: "Please fill in the required fields",
      ...req.body,
    });
    return;
  }

  if (password.length < 8) {
    res.render("auth/signup", {
      errorMessage: "Password should contain more than 8 characters",
      ...req.body,
    });
    return;
  }

  if (!/\d/g.test(password)) {
    res.render("auth/signup", {
      errorMessage: "Password should contain at least 1 number",
    });
    return;
  }
  User.findOne({ email })
    .then((foundEmail) => {
      res.render("auth/signup", {
        errorMessage: "Email already in use",
        ...req.body,
      });
    })
    .catch((err) => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: "Oh no something went dredfully wrong!",
        ...req.body,
      });
    });

  User.findOne({ username })
    .then((foundUser) => {
      if (foundUser) {
        res.render("auth/signup", {
          errorMessage: "Username taken",
          ...req.body,
        });
        return;
      }

      //password encrypting
      const saltRounds = 10;
      const saltGenerated = bcrypt.genSaltSync(saltRounds);

      const hashIt = bcrypt.hashSync(password, saltGenerated);

      //add user to database
      User.create({ username, email, password: hashIt, headset })
        .then((createdUser) => {
          console.log(createdUser);
          res.redirect("/auth/login");
        })
        .catch((err) => {
          console.log(err);
          res.render("auth/signup", {
            errorMessage: "Oh no something went dredfully wrong!",
            ...req.body,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.render("auth/signup", {
        errorMessage: "Oh no something went dredfully wrong!",
        ...req.body,
      });
    });
});
//signup

//login
router.get("/login", isNotLoggedIn, (req, res) => {
  res.render("auth/login");
});
router.post("/login", isNotLoggedIn, (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    res.render("auth/login", {
      errorMessage: "Fill in the required fields already!",
    });
    return;
  }

  User.findOne({ username }).then((foundUser) => {
    if (!foundUser) {
      res.render("auth/login", { errorMessage: "Wrong!" });
      return;
    }

    const validPassword = bcrypt.compareSync(password, foundUser.password);

    if (!validPassword) {
      res.render("auth/login", { errorMessage: "Wrong!" });
      return;
    }

    //logged in

    req.session.user = foundUser;
    res.redirect("/");
  });
});
//login

//logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    return res.redirect("/");
  });
});

module.exports = router;
