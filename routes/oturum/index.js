const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { registerSchema, loginSchema } = require("../../schemas");
//require("dotenv").config();

const router = express.Router();

router.get("/", async (req, res, next) => {
  //const users = await User.find({});
  res.json({
    message: "oturum",
  });
});

router.post("/girisyap", async (req, res, next) => {
  try {
    const validUser = await loginSchema.validateAsync(req.body);

    const user = await User.findOne({
      mail: validUser.mail,
    });

    if (!user) {
      throw new Error("E-Mail veya Şifre Yanlış");
    }

    const passwordMatches = await bcrypt.compare(
      validUser.password,
      user.password
    );

    if (!passwordMatches) {
      throw new Error("E-Mail veya Şifre Yanlış");
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
          throw new Error("E-Mail veya Şifre Yanlış");
        }
        res.status(202).json({ token });
      }
    );
  } catch (err) {
    next(err);
  }
});

router.post("/kayitol", async (req, res, next) => {
  try {
    const validUser = await registerSchema.validateAsync(req.body);

    const isMailExists = await User.findOne({
      mail: validUser.mail,
    });

    if (isMailExists) {
      throw new Error("Mail Sistemde Kayıtlı");
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
