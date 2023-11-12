const product_type = require("../controllers/product_type.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", product_type.create);
// Retrieve all product_type
router.get("/getall",[authJwt.verifyToken], product_type.findAll);
// Retrieve all published product_type
// router.get("/published", product_type.findAllPublished);
// Retrieve product_type by Page
router.get("/getbypage", product_type.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", product_type.findOne);
// Update a Tutorial with id
router.put("/:id", product_type.update);
// Delete a Tutorial with id
router.delete("/:id", product_type.delete);
// Delete all product_type
router.delete("/",[authJwt.verifyToken], product_type.deleteAll);

module.exports = router;