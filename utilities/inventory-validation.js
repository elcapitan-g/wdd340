const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");
const validate = {};

/* -------------------------------
 * Classification Validation Rules
 * ------------------------------ */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Please provide a valid classification name."),
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

/* -------------------------------
 * Inventory Add Validation Rules
 * ------------------------------ */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim().escape().notEmpty().isLength({ min: 1 })
      .withMessage("Please provide a make."),
    body("inv_model")
      .trim().escape().notEmpty().isLength({ min: 1 })
      .withMessage("Please provide a model."),
    body("inv_year")
      .trim().escape().notEmpty().isInt({ min: 1900, max: 2030 })
      .withMessage("Year must be a number between 1900 and 2030."),
    body("inv_description")
      .trim().escape().notEmpty().isLength({ min: 1 })
      .withMessage("Please provide a description."),
    body("inv_image")
      .trim().escape().notEmpty()
      .withMessage("Please provide an image path."),
    body("inv_thumbnail")
      .trim().escape().notEmpty()
      .withMessage("Please provide a thumbnail path."),
    body("inv_price")
      .trim().escape().notEmpty().isFloat()
      .withMessage("Price must be a number."),
    body("inv_miles")
      .trim().escape().notEmpty().isInt()
      .withMessage("Miles must be a number."),
    body("inv_color")
      .trim().escape().notEmpty()
      .withMessage("Please provide a color."),
    body("classification_id")
      .notEmpty().isInt()
      .withMessage("Please select a classification."),
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

/* -------------------------------
 * Inventory Update Validation
 * ------------------------------ */
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
