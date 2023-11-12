const cart = require("../controllers/cart.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", cart.create);
// Retrieve all cart
router.get("/getall",[authJwt.verifyToken], cart.findAll);
// Retrieve all published cart
// router.get("/published", cart.findAllPublished);
// Retrieve cart by Page
router.get("/getbypage", cart.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", cart.findOne);
// Update a Tutorial with id
router.put("/:id", cart.update);
// Delete a Tutorial with id
router.delete("/:id", cart.delete);
// Delete all cart
router.delete("/",[authJwt.verifyToken], cart.deleteAll);
router.post("/checkout", cart.checkout);
router.post("/payment", cart.payment);
module.exports = router;