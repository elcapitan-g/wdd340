const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const fs = require("fs"); 

try {
  const files = fs.readdirSync("./routes");
  console.log("✅ Files in ./routes:", files);
} catch (err) {
  console.error("❌ Could not read ./routes/:", err);
}


const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute.js");
const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js");
const utilities = require("./utilities/index.js");


app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/layout"); 


app.use(static);


app.get("/", utilities.handleErrors(baseController.buildHome));


app.use("/inv", inventoryRoute);

app.use("/ierror", intentionalErrorRoute);

app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Unfortunately, we don't have that page in stock.",
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

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, () => {
  console.log(`✅ App listening on ${host}:${port}`);
});
