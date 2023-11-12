const account = require("../controllers/account.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", account.create);
// Retrieve all account
router.get("/getall",[authJwt.verifyToken], account.findAll);
// Retrieve all published account
// router.get("/published", account.findAllPublished);
// Retrieve account by Page
router.get("/getbypage", account.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", account.findOne);
// Update a Tutorial with id
router.put("/:id", account.update);
// Delete a Tutorial with id
router.delete("/:id", account.delete);
// Delete all account
router.delete("/",[authJwt.verifyToken], account.deleteAll);

module.exports = router;