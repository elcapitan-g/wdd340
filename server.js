const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

try {
  const files = fs.readdirSync("./routes");
  console.log("✅ Files in ./routes:", files);
} catch (err) {
  console.error("xCould not read ./routes/:", err);
}

const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute.js");
const accountRoute = require("./routes/accountRoute");
const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js");
const utilities = require("./utilities/index.js");
const pool = require("./database");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout");

app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.messages = () => req.flash();
  next();
});

app.use(utilities.checkJWTToken);

app.use(static);
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use("/ierror", intentionalErrorRoute);

app.get("/favicon.ico", (req, res) => res.status(204).end());

app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Cannot find it in stock.",
  });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.dir(err);
  let message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});
