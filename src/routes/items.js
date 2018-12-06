const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController")
const validation = require("./validation");



//recieves requests from ejs pages and passes to itemController
router.get("/items", itemController.index);
router.get("/items/add", itemController.add);
router.get("/items/:id/:name", itemController.show);
router.post("/items/create", validation.validateItems, itemController.create);
router.get("/items/:id/:name/delete", itemController.delete);
router.post("/items/:id/:name/destroy", itemController.destroy);
router.get("/items/:id/:name/edit", itemController.edit);
router.post("/items/:id/:name/update", validation.validateItems, itemController.update);







module.exports = router;
