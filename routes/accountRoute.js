const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Account Management View (requires login)
router.get("/", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagementView)
);

// Login
router.get("/login", 
  utilities.handleErrors(accountController.buildLogin)
);
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Logout
router.get("/logout", 
  utilities.handleErrors(accountController.accountLogout)
);

// Registration
router.get("/registration", 
  utilities.handleErrors(accountController.buildRegister)
);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Account Update View
router.get("/update/:account_id", 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildUpdate)
);

// Account Info Update Handler
router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Password Update Handler
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
