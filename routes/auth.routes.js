  // app.post(
  //   "/api/auth/signup",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted
  //   ],
  //   controller.signup
  // );

  var express = require('express');
  var router = express.Router();
  // const { verifySignUp } = require("../middleware");
  const controller = require("../controllers/auth.controller");
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  router.post("/signin", controller.signin);
  router.post("/register", controller.register);
   
  module.exports = router;