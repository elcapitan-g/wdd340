

const utilities = require("../utilities/");  

const baseController = {};

baseController.buildHome = (req, res) => {
    res.render("index", {
        title: " Our Inventory ",
    });
};

baseController.errorHandler = (err, req, res, next) => {
    console.error("Error occurred:", err);
    
    res.status(err.status || 500).render("error", {
        message: err.message || "Something went wrong!",
        error: err,
    });
};


baseController.renderView = async (req, res, view, data = {}) => {
    try {
        const nav = await utilities.getNav(); 
        const title = data.title || "Default Title"; 
        
        res.render(view, {
            nav,          
            title,        
            ...data,      
        });
    } catch (error) {
        console.error("Error rendering view:", error);
        next(error);  
    }
};

module.exports = baseController;
