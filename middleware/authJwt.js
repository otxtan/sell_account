const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
//const User = db.user;
verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "A token is required for authentication!"
    });
  }
  // jwt.verify(token, config.secret, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).send({
  //       message: "Unauthorized!"
  //     });
  //   }
  //   console.log(decoded)
  //   req.user = decoded;
  //   next();
  // });
  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
const authJwt = {
  verifyToken: verifyToken
};
module.exports = authJwt;