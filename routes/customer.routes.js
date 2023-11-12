const customer = require("../controllers/customer.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", customer.create);
// Retrieve all customer
router.get("/getall",[authJwt.verifyToken], customer.findAll);
// Retrieve all published customer
router.get("/published", customer.findAllPublished);
// Retrieve customer by Page
router.get("/getbypage", customer.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", customer.findOne);
// Update a Tutorial with id
router.put("/:id", customer.update);
// Delete a Tutorial with id
router.delete("/:id", customer.delete);
// Delete all customer
router.delete("/",[authJwt.verifyToken], customer.deleteAll);

module.exports = router;