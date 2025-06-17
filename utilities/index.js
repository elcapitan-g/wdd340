const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Util = {};
console.log("JWT_SECRET is:", process.env.JWT_SECRET);

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

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    return next(); 
  } else {
    
    return res.redirect("/account/login");
  }
};

Util.checkAuthorizationManager = (req, res, next) => {
  next();
};


Util.checkJWTToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    res.locals.accountData = null;
    res.locals.loggedin = 0;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.accountData = decoded;
    res.locals.loggedin = 1;
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.clearCookie("jwt");
    res.locals.accountData = null;
    res.locals.loggedin = 0;
  }

  next();
};

Util.updateCookie = (accountData, res) => {
  const token = jwt.sign(accountData, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 3600000,
  });
};

module.exports = Util;
