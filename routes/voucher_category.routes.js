const voucher_category = require("../controllers/voucher_category.controller.js");
const { authJwt } = require("../middleware/index.js");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", voucher_category.create);
// Retrieve all voucher
router.get("/getall",[authJwt.verifyToken], voucher_category.findAll);
// Retrieve all published voucher
// router.get("/fixeddiscount", voucher.findAllFixedDiscount);
// Retrieve voucher by Page
router.get("/getbypage", voucher_category.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", voucher_category.findOne);
// Update a Tutorial with id
router.put("/:id", voucher_category.update);
// Delete a Tutorial with id
router.delete("/:id", voucher_category.delete);
// Delete all voucher_category
router.delete("/",[authJwt.verifyToken], voucher_category.deleteAll);

module.exports = router;