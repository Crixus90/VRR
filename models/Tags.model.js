const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  text: {
    type: String,
  },
});

const Tag = mongoose.model("Tag", tagSchema);
