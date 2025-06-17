const checkAccountType = (req, res, next) => {
  if (!req.accountData) {
    req.flash("notice", "You must be logged in.");
    return res.redirect("/account/login");
  }

  const type = req.accountData.account_type;

  if (type === "Employee" || type === "Admin") {
    return next();
  }

  req.flash("notice", "Access denied. You must be an Employee or Admin.");
  return res.redirect("/account/login");
};

module.exports = checkAccountType;
