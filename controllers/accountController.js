const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const utilities = require("../utilities");
const accountModel = require("../models/account-model");

async function buildRegister(req, res) {
  let nav = await utilities.getNav();
  // Pass empty strings for form fields initially to avoid undefined or [object Object]
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
    account_firstname: "",
    account_lastname: "",
    account_email: "",
  });
}

async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      return res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: "", // Clear email after successful registration
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      return res.status(501).render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    console.error(error);
    req.flash("notice", "An error occurred during registration.");
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function buildLogin(req, res) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email: "",
  });
}

async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      utilities.updateCookie(accountData, res);
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Incorrect password.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    req.flash("notice", "Login failed.");
    return res.redirect("/account/login");
  }
}

async function buildAccountManagementView(req, res) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: req.session.account,
  });
}

async function accountLogout(req, res) {
  res.clearCookie("jwt");
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.");
  res.redirect("/");
}

async function buildUpdate(req, res) {
  let nav = await utilities.getNav();
  const accountDetails = await accountModel.getAccountById(req.params.account_id);

  if (!accountDetails) {
    req.flash("notice", "Account not found.");
    return res.redirect("/account/");
  }

  const { account_id, account_firstname, account_lastname, account_email } = accountDetails;

  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  });
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  const result = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (result) {
    const updatedAccount = await accountModel.getAccountById(account_id);
    delete updatedAccount.account_password;
    res.locals.accountData.account_firstname = updatedAccount.account_firstname;
    utilities.updateCookie(updatedAccount, res);

    req.flash("notice", "Account successfully updated.");
    return res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Account update failed.");
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function updatePassword(req, res) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(account_id, hashedPassword);

    if (result) {
      req.flash("notice", "Password successfully updated.");
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
      });
    } else {
      req.flash("notice", "Password update failed.");
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Password update error:", error);
    req.flash("notice", "An error occurred while updating the password.");
    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountManagementView,
  accountLogout,
  buildUpdate,
  updateAccount,
  updatePassword,
};
