const express = require("express");
const mongoose = require("mongoose");
const volleyball = require("volleyball");
const cors = require("cors");
//require("dotenv").config();

const app = express();

const oturum = require("./routes/oturum");
const testler = require("./routes/testler");

const { checkTokenSetUser } = require("./routes/oturum/middlewares.js");

app.use(volleyball); // logger
app.use(cors()); // cors
app.use(checkTokenSetUser); // token varsa req.user = decoded token
app.use(express.json()); //body parser
app.set("json spaces", 2); //json format

const DB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quiz-app";

mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
  res.json({
    user: req.user,
  });
});

app.use("/oturum", oturum);
app.use("/testler", testler);

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
