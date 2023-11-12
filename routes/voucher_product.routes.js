const voucher_product = require("../controllers/voucher_product.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", voucher_product.create);
// Retrieve all voucher
router.get("/getall",[authJwt.verifyToken], voucher_product.findAll);
// Retrieve all published voucher
// router.get("/fixeddiscount", voucher.findAllFixedDiscount);
// Retrieve voucher by Page
router.get("/getbypage", voucher_product.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", voucher_product.findOne);
// Update a Tutorial with id
router.put("/:id", voucher_product.update);
// Delete a Tutorial with id
router.delete("/:id", voucher_product.delete);
// Delete all voucher_product
router.delete("/",[authJwt.verifyToken], voucher_product.deleteAll);

module.exports = router;