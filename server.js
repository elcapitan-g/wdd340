// server.js (Main entry point for the application)

const express = require("express");
const app = express();

// Import routes
const inventoryRoutes = require("./routes/inventoryRoutes");
const baseController = require("./controllers/baseController");

// Set up the view engine (EJS)
app.set("view engine", "ejs");
app.set("views", "./views");  // Specify where views are stored

// Middleware to parse incoming requests
app.use(express.urlencoded({ extended: true }));  // For form data
app.use(express.json());  // For JSON payloads

// Routes
app.use("/inventory", inventoryRoutes);

// Home page route (rendering index.ejs)
app.get("/", (req, res) => {
    res.render("index", {
        title: "Welcome to Our Inventory Site",  // Title for the home page
        // Any other data you want to pass to the view can go here
    });
});

// Global error handler
app.use(baseController.errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
