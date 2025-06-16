const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Apply JWT checker and view locals setter to all account routes
router.use(utilities.checkJWTToken);
router.use(utilities.setLocals);

// Account management main page (requires login)
router.get(
  "/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagementView)
);

// Login routes
router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Logout route
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Register routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Update account view (requires login)
router.get(
  "/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdate)
);

// Update account info (requires login)
router.post(
  "/update",
  utilities.checkLogin,
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Update password (requires login)
router.post(
  "/update-password",
  utilities.checkLogin,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
