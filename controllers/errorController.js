
const baseController = require("./baseController");

const errorController = {};

errorController.triggerError = (req, res, next) => {

    const error = new Error("This is a test error.");
    error.status = 500; 
    next(error); 
};

module.exports = errorController;
