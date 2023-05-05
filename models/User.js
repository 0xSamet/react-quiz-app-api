const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: "Name is required" },
  mail: { type: String, required: "E-Mail is required" },
  password: { type: String, required: "Password is required" },
  quizzes: { type: Array, default: [] },
  createdAt: { type: String, default: Date.now() },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
