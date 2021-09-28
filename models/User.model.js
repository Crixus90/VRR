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
    default:
      "https://images.clipartlogo.com/files/istock/previews/1013/101367273-man-with-virtual-reality-headset-icon-vector.jpg",
  },
});

const User = model("User", userSchema);

module.exports = User;
