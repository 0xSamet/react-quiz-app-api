const express = require("express");
const moment = require("moment");

const Quiz = require("../../models/Quiz");

const router = express.Router();

const { isLoggedIn } = require("../auth/middlewares");

const { quizSchema } = require("../../schemas");

router.get("/", async (req, res, next) => {
  try {
    const { q } = req.query;

    if (q) {
      const quizzes = await Quiz.find({
        description: { $regex: q, $options: "i" },
      }).populate("author", "name");

      res.json(quizzes);

      return;
    }

    const quizzes = await Quiz.find({}).populate("author", "name");
    res.json(quizzes);
  } catch (err) {
    next(err);
  }
});

router.get("/:quizId", async (req, res, next) => {
  try {
    const { quizId } = req.params;

    console.log(req.params);
    if (quizId) {
      const quiz = await Quiz.findOne({
        _id: quizId,
      }).populate("author", "name");

      return res.json({ quiz });
    }

    throw new Error(`Not Found - ${quizId}`);
  } catch (err) {
    next(err);
  }
});

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const validQuiz = await quizSchema.validateAsync(req.body);

    const newQuiz = new Quiz(req.body);
    newQuiz.author = req.user._id;
    newQuiz.createdAt = moment().format("Do MMMM YYYY, h:mm:ss a");

    await newQuiz.save();

    res.status(201).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
