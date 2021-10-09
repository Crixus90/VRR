const router = require("express").Router();
const nodemailer = require("nodemailer");

//nodemailer

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ef3c55dca21f56",
    pass: "6f191b6a01077d",
  },
});

router.get("/", (req, res) => {
  res.render("contact-page");
});

router.post("/", (req, res) => {
  const { name, message, email, subject } = req.body;

  transport.sendMail({
    from: email, // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    // html: "<b>Hello world?</b>", // html body
  });
  res.redirect("/");
});

module.exports = router;
