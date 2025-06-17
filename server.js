const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv").config();
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// Log route files at startup
try {
  const files = fs.readdirSync("./routes");
  console.log("✅ Files in ./routes:", files);
} catch (err) {
  console.error("❌ Could not read ./routes/:", err);
}

// Import routes and controllers
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const intentionalErrorRoute = require("./routes/intentionalErrorRoute");
const utilities = require("./utilities/index");

// Set up EJS with layouts
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

// Middleware
app.use(express.static("public")); // ✅ serve static files
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: true })); // parse form POST data

// Flash messages in all views
app.use((req, res, next) => {
  res.locals.messages = () => req.flash();
  next();
});

// JWT + view locals middleware
app.use(utilities.checkJWTToken);
app.use(utilities.setLocals);

// Route handling
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/ierror", intentionalErrorRoute);

// Favicon
app.get("/favicon.ico", (req, res) => res.status(204).end());

// 404 Catch-all
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Cannot find it in stock.",
  });
});

// General Error Handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.dir(err);
  let message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// Start the server
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});
