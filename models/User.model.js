const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  headset: {
    type: String,
  },
  image: {
    type: String,
    default: "/images/virtual-reality.png",
  },
  bio: {
    type: String,
  },
});

const User = model("User", userSchema);

module.exports = User;
