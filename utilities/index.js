const invModel = require("../models/inventory-model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const Util = {};

/**
 * Builds the dynamic navigation menu HTML
 * @returns {Promise<string>} navigation HTML string
 */
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

/**
 * Builds an HTML grid for vehicle classifications
 * @param {Array} data Array of vehicle objects
 * @returns {Promise<string>} HTML grid string
 */
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

/**
 * Builds a detailed item listing HTML snippet
 * @param {Object} data Vehicle object
 * @returns {Promise<string>} HTML snippet
 */
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

/**
 * Builds a classification dropdown list for forms
 * @param {number|null} classification_id The classification to pre-select (optional)
 * @returns {Promise<string>} HTML select dropdown
 */
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

/**
 * Wraps async route handlers to catch errors
 * @param {Function} fn Async function (req, res, next)
 * @returns {Function} Express middleware
 */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Middleware: Check for JWT token in cookies, verify and attach decoded data to req.accountData
 */
Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies?.jwt; // JWT cookie named 'jwt'
  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT verification error:", err.message);
      return next();
    }
    req.accountData = decoded;
    next();
  });
};

/**
 * Middleware: Sets res.locals properties for views based on login status
 */
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

/**
 * Middleware placeholder to check if user is logged in
 * You can customize this to redirect or deny access if not logged in
 */
Util.checkLogin = (req, res, next) => {
  if (req.accountData) {
    return next();
  }
  // Example: redirect to login if not logged in
  // res.redirect('/account/login');
  next();
};

/**
 * Middleware placeholder to check for authorization (e.g., employee/admin)
 * You should enhance this with actual role checks from req.accountData
 */
Util.checkAuthorizationManager = (req, res, next) => {
  if (!req.accountData) {
    // Not logged in
    return res.redirect("/account/login");
  }

  const allowedRoles = ["employee", "admin"];
  if (allowedRoles.includes(req.accountData.account_type)) {
    return next();
  }

  // Forbidden
  res.status(403).render("errors/error", {
    title: "Forbidden",
    message: "You do not have permission to access this resource.",
    nav: null, // optionally get nav here
  });
};

/**
 * Optional: Method to update JWT cookie on login or refresh (implement as needed)
 */
Util.updateCookie = (accountData, res) => {
  // Example:
  // const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  // res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
};

module.exports = Util;
