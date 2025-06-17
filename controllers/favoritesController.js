const favoritesModel = require("../models/favorites-model");
const utilities = require("../utilities");

const favoritesController = {};

favoritesController.showFavorites = async function(req, res, next) {
  try {
    const user_id = res.locals.accountData.account_id;
    const data = await favoritesModel.getFavoritesByUser(user_id);
    let nav = await utilities.getNav();
    res.render("favorites/favorites", {
      title: "My Favorite Vehicles",
      nav,
      favorites: data.rows,
      loggedin: 1,
    });
  } catch (error) {
    next(error);
  }
};

favoritesController.addFavorite = async function(req, res, next) {
  try {
    const user_id = res.locals.accountData.account_id;
    const { inv_id } = req.body;
    await favoritesModel.addFavorite(user_id, inv_id);
    res.redirect("back");
  } catch (error) {
    next(error);
  }
};

favoritesController.removeFavorite = async function(req, res, next) {
  try {
    const user_id = res.locals.accountData.account_id;
    const { inv_id } = req.body;
    await favoritesModel.removeFavorite(user_id, inv_id);
    res.redirect("back");
  } catch (error) {
    next(error);
  }
};

module.exports = favoritesController;
