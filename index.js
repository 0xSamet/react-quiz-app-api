const express = require("express");
const mongoose = require("mongoose");
const volleyball = require("volleyball");
const cors = require("cors");
require("dotenv").config();

const app = express();

const authRoute = require("./routes/auth");
const quizRoute = require("./routes/quizzes");

const { checkTokenSetUser } = require("./routes/auth/middlewares.js");

app.use(volleyball);
app.use(cors());
app.use(checkTokenSetUser);
app.use(express.json());
app.set("json spaces", 2);

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz-app";

(async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connection Established");
  } catch (err) {
    console.log("MongoDB Connect Error", err);
  }
})();

app.use("/auth", authRoute);
app.use("/quizzes", quizRoute);

const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
  });
};

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5006;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
