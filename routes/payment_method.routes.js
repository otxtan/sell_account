const payment_method = require("../controllers/payment_method.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", payment_method.create);
// Retrieve all payment_method
router.get("/getall", payment_method.findAll);
// Retrieve all published payment_method
// router.get("/published", payment_method.findAllPublished);
// Retrieve payment_method by Page
router.get("/getbypage", payment_method.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", payment_method.findOne);
// Update a Tutorial with id
router.put("/:id", payment_method.update);
// Delete a Tutorial with id
router.delete("/:id", payment_method.delete);
// Delete all payment_method
router.delete("/",[authJwt.verifyToken], payment_method.deleteAll);

module.exports = router;