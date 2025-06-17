const jwt = require("jsonwebtoken");

function checkJWT(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.locals.accountData = null;
        res.locals.loggedin = 0;
        return next();
      }
      res.locals.accountData = decoded;
      res.locals.loggedin = 1;
      next();
    });
  } else {
    res.locals.accountData = null;
    res.locals.loggedin = 0;
    next();
  }
}

module.exports = { checkJWT };
