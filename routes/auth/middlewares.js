const jwt = require("jsonwebtoken");

const checkTokenSetUser = (req, res, next) => {
  const authHeader = req.get("authorization");
  if (authHeader) {
    token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) {
          res.status(401);
          const error = new Error(err);
          next(err);
        }
        req.user = user;
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    const error = new Error("Unauthorized");
    res.status(401);
    next(error);
  }
};

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
};
