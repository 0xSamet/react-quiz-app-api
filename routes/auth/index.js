const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { registerSchema, loginSchema } = require("../../schemas");

const router = express.Router();

router.get("/me", (req, res) => {
  res.json({
    user: req.user,
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const validUser = await loginSchema.validateAsync(req.body);

    const user = await User.findOne({
      mail: validUser.mail,
    });

    if (!user) {
      throw new Error("E-mail or password is incorrect");
    }

    const passwordMatches = await bcrypt.compare(
      validUser.password,
      user.password
    );

    if (!passwordMatches) {
      throw new Error("E-mail or password is incorrect");
    }

    const payload = {
      _id: user._id,
      mail: user.mail,
      name: user.name,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) {
          throw new Error("Internal Server Error");
        }

        res.status(202).json({ token, user: payload });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const validUser = await registerSchema.validateAsync(req.body);

    const isMailExists = await User.findOne({
      mail: validUser.mail,
    });

    if (isMailExists) {
      throw new Error("Mail is already in use");
    }

    const newUser = new User(req.body);
    newUser.name = newUser.name.trim();
    newUser.mail = newUser.mail.trim();
    newUser.password = newUser.password.trim();
    newUser.password = await bcrypt.hash(newUser.password, 8);
    await newUser.save();

    const payload = {
      _id: newUser.id,
      name: newUser.name,
      mail: newUser.mail,
      password: newUser.password,
    };

    res.status(201).json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
