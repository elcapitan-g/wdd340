
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const errorController = require("../controllers/errorController");

router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:inv_id", invController.buildByInventoryId);

router.get("/trigger-error", errorController.triggerError);

module.exports = router;
