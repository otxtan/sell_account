const transaction = require("../controllers/transaction.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", transaction.create);
// Retrieve all transaction
router.get("/getall",[authJwt.verifyToken], transaction.findAll);
// Retrieve all published transaction
// router.get("/published", transaction.findAllPublished);
// Retrieve transaction by Page
router.get("/getbypage", transaction.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", transaction.findOne);
// Update a Tutorial with id
router.put("/:id", transaction.update);
// Delete a Tutorial with id
router.delete("/:id", transaction.delete);
// Delete all transaction
router.delete("/",[authJwt.verifyToken], transaction.deleteAll);
router.get("/transactionResults/:id",transaction.transactionResults);
router.put("/confirmPayment/:id",transaction.confirmPayment);
module.exports = router;