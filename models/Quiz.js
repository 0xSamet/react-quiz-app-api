const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Answer = new Schema({
  index: { type: Number, required: "Answer Index is required" },
  description: { type: String, required: "Answer Description is required" },
});

const Question = new Schema({
  description: { type: String, required: "Description is required" },
  answers: [Answer],
  answerIndex: { type: Number, required: "Answer Index is required" },
});

const quizSchema = new Schema({
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: "Author is required",
  },
  description: { type: String, required: "Description is required" },
  questions: [Question],
  createdAt: { type: String, required: "Creation Time is required" },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
