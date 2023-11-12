const subscription_plan = require("../controllers/subscription_plan.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", subscription_plan.create);
// Retrieve all subscription_plan
router.get("/getall",[authJwt.verifyToken], subscription_plan.findAll);
// Retrieve all published subscription_plan
// router.get("/published", subscription_plan.findAllPublished);
// Retrieve subscription_plan by Page
router.get("/getbypage", subscription_plan.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", subscription_plan.findOne);
// Update a Tutorial with id
router.put("/:id", subscription_plan.update);
// Delete a Tutorial with id
router.delete("/:id", subscription_plan.delete);
// Delete all subscription_plan
router.delete("/",[authJwt.verifyToken], subscription_plan.deleteAll);

module.exports = router;