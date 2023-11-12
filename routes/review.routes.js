const review = require("../controllers/review.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", review.create);
// Retrieve all review
router.get("/getall",[authJwt.verifyToken], review.findAll);
// Retrieve all published review
router.get("/published", review.findAllPublished);
// Retrieve review by Page
router.get("/getbypage", review.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", review.findOne);
// Update a Tutorial with id
router.put("/:id", review.update);
// Delete a Tutorial with id
router.delete("/:id", review.delete);
// Delete all review
router.delete("/",[authJwt.verifyToken], review.deleteAll);

module.exports = router;