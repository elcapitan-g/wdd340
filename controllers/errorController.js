// controllers/errorController.js

const baseController = require("./baseController");

const errorController = {};

// Trigger an intentional error (e.g., for testing)
errorController.triggerError = (req, res, next) => {
    // Intentionally create an error (can be customized for testing purposes)
    const error = new Error("This is a test error.");
    error.status = 500; // Set HTTP status code to 500 for internal server error
    next(error); // Pass the error to the next middleware (i.e., error handler)
};

module.exports = errorController;
