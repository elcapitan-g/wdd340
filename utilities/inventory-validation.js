const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const validate = {};


validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isAlphanumeric()
      .withMessage("Classification name must be alphanumeric with no spaces.")
      .isLength({ min: 1, max: 30 })
      .withMessage("Classification name must be 1–30 characters long."),
  ];
};

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    return res.render("inventory/addClassification", {
      title: "Add Classification",
      nav,
      errors,
      classification_name,
    });
  }
  next();
};


validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim().escape().notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 2, max: 50 })
      .withMessage("Make must be 2–50 characters."),
    body("inv_model")
      .trim().escape().notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 2, max: 50 })
      .withMessage("Model must be 2–50 characters."),
    body("inv_year")
      .trim().escape().notEmpty()
      .withMessage("Year is required.")
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Year must be between 1900 and 2030."),
    body("inv_description")
      .trim().escape().notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 2, max: 100 })
      .withMessage("Description must be 2–100 characters."),
    body("inv_image")
      .trim().escape().notEmpty()
      .withMessage("Image path is required."),
    body("inv_thumbnail")
      .trim().escape().notEmpty()
      .withMessage("Thumbnail path is required."),
    body("inv_price")
      .trim().escape().notEmpty()
      .withMessage("Price is required.")
      .isFloat()
      .withMessage("Price must be a valid number."),
    body("inv_miles")
      .trim().escape().notEmpty()
      .withMessage("Miles is required.")
      .isInt()
      .withMessage("Miles must be a whole number."),
    body("inv_color")
      .trim().escape().notEmpty()
      .withMessage("Color is required."),
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification.")
      .isInt()
      .withMessage("Classification ID must be a valid number."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classifications = await utilities.buildClassificationList(req.body.classification_id);
    return res.render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors,
      classifications,
      ...req.body,
    });
  }
  next();
};

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classifications = await utilities.buildClassificationList(req.body.classification_id);
    return res.render("inventory/editInventory", {
      title: "Edit " + req.body.inv_make + " " + req.body.inv_model,
      nav,
      errors,
      classifications,
      ...req.body,
    });
  }
  next();
};

module.exports = validate;
