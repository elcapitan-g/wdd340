const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Apply JWT checker and view locals setter to all account routes
router.use(utilities.checkJWTToken);
router.use(utilities.setLocals);

// Account management (protected)
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

// Logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Register routes
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Update account view (protected)
router.get(
  "/update/:accountId", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdate)
);

// Update account info (protected)
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updateAccount)
);

// Update password (protected)
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.checkLogin,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
