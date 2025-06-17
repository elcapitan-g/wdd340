const express = require("express");
const router = new express.Router();
const favoritesController = require("../controllers/favoritesController");
const utilities = require("../utilities");

function requireLogin(req, res, next) {
  if (!res.locals.loggedin) {
    req.flash("error", "You must be logged in to view this page.");
    return res.redirect("/account/login");
  }
  next();
}

router.get("/", requireLogin, utilities.handleErrors(favoritesController.showFavorites));

router.post("/add", requireLogin, utilities.handleErrors(favoritesController.addFavorite));

router.post("/remove", requireLogin, utilities.handleErrors(favoritesController.removeFavorite));

module.exports = router;
