// routes/inventoryRoutes.js

const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const errorController = require("../controllers/errorController");

// Route to display inventory by classification ID
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to display inventory detail by inventory ID
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to trigger an intentional error (for testing)
router.get("/trigger-error", errorController.triggerError);

module.exports = router;
