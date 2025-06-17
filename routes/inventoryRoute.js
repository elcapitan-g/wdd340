const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");
const checkAccountType = require("../middleware/checkAccountType");

router.get(
  "/",
  checkAccountType,
  utilities.handleErrors(invController.buildManagementView)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

router.get(
  "/add-classification",
  checkAccountType,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  checkAccountType,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  checkAccountType,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/edit/:inventoryId",
  checkAccountType,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update",
  checkAccountType,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inventoryId",
  checkAccountType,
  utilities.handleErrors(invController.buildDeleteInventory)
);

router.post(
  "/delete/",
  checkAccountType,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
