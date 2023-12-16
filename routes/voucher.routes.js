const voucher = require("../controllers/voucher.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", voucher.create);
// Retrieve all voucher
router.get("/getall",[authJwt.verifyToken], voucher.findAll);
// Retrieve all published voucher
router.get("/fixeddiscount", voucher.findAllFixedDiscount);
// Retrieve voucher by Page
router.get("/getbypage", voucher.findAllByPage);
router.post("/getbyproductcategory",voucher.findAllbyProductCategory);
router.get("/findAllVoucherCategoryProductByPage",voucher.findAllVoucherCategoryProductByPage);

// Retrieve a single Tutorial with id
router.get("/:code", voucher.findOne);
router.get("/findOneIncludeCategoryOrProduct/:code", voucher.findOneIncludeCategoryOrProduct);
// Update a Tutorial with id
router.put("/:code", voucher.update);
router.put("/updateVoucherVoucherCategoryProduct/:code", voucher.updateVoucherVoucherCategoryProduct);

// Delete a Tutorial with id
router.delete("/:code", voucher.delete);
// Delete all voucher
router.delete("/",[authJwt.verifyToken], voucher.deleteAll);

module.exports = router;