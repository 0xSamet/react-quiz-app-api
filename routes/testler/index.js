const express = require("express");
const moment = require("moment");
moment.locale("tr");

const Quiz = require("../../models/Quiz");

const router = express.Router();

const { isLoggedIn } = require("../oturum/middlewares");

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

router.get("/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: "test " + id,
  });
});

/*router.post("/signup", (req, res) => {
  res.json(req.body);
});*/

module.exports = router;
