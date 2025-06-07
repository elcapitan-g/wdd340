// controllers/baseController.js

const utilities = require("../utilities/");  // Assuming utilities contains helper functions for navigation, etc.

const baseController = {};

// Home page route handler
baseController.buildHome = (req, res) => {
    res.render("index", {
        title: "Welcome to Our Inventory Site",
        // You can add more data to be passed to the view, if necessary
    });
};

// Common error handler
baseController.errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);
    
    // Send the error to an error view with a custom message
    res.status(err.status || 500).render("error", {
        message: err.message || "Something went wrong!",
        error: err,
    });
};

// Helper function for rendering a standard view with common properties
baseController.renderView = async (req, res, view, data = {}) => {
    try {
        const nav = await utilities.getNav(); // Assuming you have a utility function to get navigation
        const title = data.title || "Default Title"; // Set default title if not provided
        
        // Render the view with navigation, title, and any additional data passed
        res.render(view, {
            nav,          // Common navigation
            title,        // Page title
            ...data,      // Spread additional data passed to the view (e.g. vehicle details, etc.)
        });
    } catch (error) {
        console.error("Error rendering view:", error);
        next(error);  // Pass to the next error handler if view rendering fails
    }
};

module.exports = baseController;
