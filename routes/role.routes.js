const role = require("../controllers/role.controller.js");
const { authJwt } = require("../middleware");

var router = require("express").Router();
// Create a new Tutorial
router.post("/", role.create);
// Retrieve all role
router.get("/getall", role.findAll);
// Retrieve all published role
router.get("/published", role.findAllPublished);
// Retrieve role by Page
router.get("/getbypage", role.findAllByPage);
// Retrieve a single Tutorial with id
router.get("/:id", role.findOne);
// Update a Tutorial with id
router.put("/:id", role.update);
// Delete a Tutorial with id
router.delete("/:id", role.delete);
// Delete all role
router.delete("/",[authJwt.verifyToken], role.deleteAll);

module.exports = router;