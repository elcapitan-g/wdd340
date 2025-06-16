const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");

const validate = {};

/* -------- Registration Validation Rules -------- */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email.");
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."),
  ];
};

/* -------- Login Validation -------- */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty."),
  ];
};

/* -------- Update Info Rules -------- */
validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists && account_email !== req.body.old_email) {
          throw new Error("Email exists. Please use a different one.");
        }
      }),
  ];
};

/* -------- Update Password Rules -------- */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and symbol."),
  ];
};

/* -------- Registration Data Check -------- */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/register", {
      title: "Registration",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* -------- Login Data Check -------- */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email,
    });
    return;
  }
  next();
};

/* -------- Update Info Data Check -------- */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/update", {
      title: "Update",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* -------- Update Password Data Check -------- */
validate.checkUpdatePasswordData = async (req, res, next) => {
  // Only password field is validated here, but include account_id for context
  const { account_id } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    res.render("account/update-password", { // Use a separate view if applicable
      title: "Update Password",
      nav,
      errors,
      account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
