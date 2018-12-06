const express = require("express");
const router = express.Router();
const markController = require("../controllers/markController");


router.get("/items/:id/marks/upmark", markController.upmark);
router.get("/items/:id/marks/downmark", markController.downmark);

module.exports = router;
