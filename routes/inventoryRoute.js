const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inventory-validation");

const { checkLogin } = require("../utilities");

router.get(
  "/",
  checkLogin,
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
  checkLogin,
  utilities.handleErrors(invController.buildAddClassification)
);

router.post(
  "/add-classification",
  checkLogin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/add-inventory",
  checkLogin,
  utilities.handleErrors(invController.buildAddInventory)
);

router.post(
  "/add-inventory",
  checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/edit/:inventoryId",
  checkLogin,
  utilities.handleErrors(invController.buildEditInventory)
);

router.post(
  "/update",
  checkLogin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inventoryId",
  checkLogin,
  utilities.handleErrors(invController.buildDeleteInventory)
);

router.post(
  "/delete/",
  checkLogin,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;
