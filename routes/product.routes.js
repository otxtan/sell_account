const product = require("../controllers/product.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", product.create);
// Retrieve all product
router.get("/getall", product.findAll);
// Retrieve all published product
router.get("/published", product.findAllPublished);
// Retrieve product by Page
router.get("/getbypage", product.findAllByPage);
router.get("/findAllProductDetailByPage", product.findAllProductDetailByPage);
router.get("/findallbyCategoryNamebypage", product.findAllProductByCategoryByPage);
router.get("/findallproductcategorytypebypage", product.findAllProductCategoryTypeByPage);
router.post("/getProductCheckout", product.getProductCheckOut);
// Retrieve a single Tutorial with id
router.get("/:id", product.findOne);
router.get("/detail/:id", product.findOneDetail);
// Update a Tutorial with id
router.put("/:id", product.update);
// Delete a Tutorial with id
router.delete("/:id", product.delete);
// Delete all product
router.delete("/",[authJwt.verifyToken], product.deleteAll);

module.exports = router;