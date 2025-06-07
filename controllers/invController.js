// controllers/invController.js

const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const baseController = require("./baseController");

const invCont = {};

// Display vehicles by classification
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    try {
        const data = await invModel.getInventoryByClassificationId(classification_id);
        const grid = await utilities.buildByClassificationGrid(data);
        const className = data[0].classification_name; 

        baseController.renderView(req, res, "./inventory/classification", {
            title: className + " Vehicles",
            grid,
        });
    } catch (error) {
        console.error("Error in buildByClassificationId:", error);
        next(error);  
    }
};

// Display details of a specific inventory item
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    try {
        const data = await invModel.getInventoryById(inv_id);
        const grid = await utilities.buildInventoryDetail(data);

        baseController.renderView(req, res, "./inventory/inventoryDetail", {
            title: `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`,
            inv_year: data[0].inv_year,
            inv_make: data[0].inv_make,
            inv_model: data[0].inv_model,
            inv_description: data[0].inv_description,
            inv_image: data[0].inv_image,
            inv_price: data[0].inv_price,
            inv_miles: data[0].inv_miles,
            inv_color: data[0].inv_color,
            grid,
        });
    } catch (error) {
        console.error("Error in buildByInventoryId:", error);
        next(error);  
    }
};

module.exports = invCont;
