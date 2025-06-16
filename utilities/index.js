const invModel = require("../models/inventory-model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const Util = {};

Util.getNav = async function () {
  const data = await invModel.getClassifications();
  let nav = "<ul>";
  nav += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    nav += `<li><a href="/inv/type/${row.classification_id}" title="View ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  nav += "</ul>";
  return nav;
};

Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += `<li>
        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
          <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
              ${vehicle.inv_make} ${vehicle.inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>
        </div>
      </li>`;
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildItemListing = async function (data) {
  if (!data) {
    return `<p>Sorry, no matching vehicles could be found.</p>`;
  }

  return `
    <section class="car-listing">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <div class="car-information">
        <div><h2>${data.inv_year} ${data.inv_make} ${data.inv_model}</h2></div>
        <div>${Number.parseFloat(data.inv_price).toLocaleString("en-US", {
          style: "currency",
          currency: "USD"
        })}</div>
        <div class="description">
          <p>${data.inv_description}</p>
          <dl>
            <dt>MILEAGE</dt><dd>${data.inv_miles.toLocaleString()}</dd>
            <dt>COLOR</dt><dd>${data.inv_color}</dd>
            <dt>CLASS</dt><dd>${data.classification_name}</dd>
          </dl>
        </div>
      </div>
    </section>
  `;
};

Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  let list = '<select name="classification_id" id="classificationList" required>';
  list += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    list += `<option value="${row.classification_id}"${
      row.classification_id == classification_id ? " selected" : ""
    }>${row.classification_name}</option>`;
  });
  list += "</select>";
  return list;
};

Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Middleware: JWT token check and setting res.locals for views
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt; // Make sure your JWT cookie is named 'jwt'
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return next();
    }
    // Save decoded token payload to req for further use
    req.accountData = decoded;
    return next();
  });
};

// Middleware to set res.locals for views based on login status
Util.setLocals = (req, res, next) => {
  if (req.accountData) {
    res.locals.loggedin = 1;
    res.locals.accountData = req.accountData;
  } else {
    res.locals.loggedin = 0;
    res.locals.accountData = null;
  }
  next();
};

Util.checkLogin = (req, res, next) => {
  next();
};

Util.checkAuthorizationManager = (req, res, next) => {
  next();
};

Util.updateCookie = (accountData, res) => { 
  // Optional: code to update the JWT cookie after changes to account info
};

module.exports = Util;
