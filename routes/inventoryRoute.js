const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

// Inventory management main view
router.get("/",
  utilities.handleErrors(invController.buildManagementView)
);

// AJAX route for classification selection
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Classification view routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Classification management views
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Inventory management views
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Edit inventory
router.get(
  "/edit/:inventoryId",
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Delete inventory
router.get(
  "/delete/:inventoryId",
  utilities.handleErrors(invController.buildDeleteInventory)
);

router.post(
  "/delete/",
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
