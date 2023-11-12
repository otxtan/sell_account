const user = require("../controllers/user.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", user.create);
// Retrieve all user
router.get("/getall",[authJwt.verifyToken], user.findAll);
// Retrieve all published user
router.get("/published", user.findAllPublished);
// Retrieve user by Page
router.get("/getbypage", user.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", user.findOne);
// Update a Tutorial with id
router.put("/:id", user.update);
// Delete a Tutorial with id
router.delete("/:id", user.delete);
// Delete all user
router.delete("/",[authJwt.verifyToken], user.deleteAll);

module.exports = router;