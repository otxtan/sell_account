const product_category = require("../controllers/product_category.controller.js");
const { authJwt } = require("../middleware/index.js");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", product_category.create);
// Retrieve all product_category
router.get("/getall", product_category.findAll);
// Retrieve all published product_category
// router.get("/published", product_category.findAllPublished);
// Retrieve product_category by Page
router.get("/getbypage", product_category.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", product_category.findOne);
// Update a Tutorial with id
router.put("/:id", product_category.update);
// Delete a Tutorial with id
router.delete("/:id", product_category.delete);
// Delete all product_category
router.delete("/",[authJwt.verifyToken], product_category.deleteAll);

module.exports = router;