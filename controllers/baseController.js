// controllers/baseController.js

const utilities = require("../utilities/");

const baseController = {};

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
        
        res.render(view, {
            nav,
            title,
            ...data,  // Spread in any additional properties
        });
    } catch (error) {
        console.error("Error rendering view:", error);
        next(error);  // Pass to the next error handler
    }
};

module.exports = baseController;
