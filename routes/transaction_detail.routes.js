const transaction_detail = require("../controllers/transaction_detail.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", transaction_detail.create);
// Retrieve all transaction_detail
router.get("/getall",[authJwt.verifyToken], transaction_detail.findAll);
// Retrieve all published transaction_detail
router.get("/published", transaction_detail.findAllPublished);
// Retrieve transaction_detail by Page
router.get("/getbypage", transaction_detail.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", transaction_detail.findOne);
// Update a Tutorial with id
router.put("/:id", transaction_detail.update);
// Delete a Tutorial with id
router.delete("/:id", transaction_detail.delete);
// Delete all transaction_detail
router.delete("/",[authJwt.verifyToken], transaction_detail.deleteAll);

module.exports = router;