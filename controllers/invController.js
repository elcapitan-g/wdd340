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
        const className = data[0].classification_name; // Assuming the classification name is in the first record

        baseController.renderView(req, res, "./inventory/classification", {
            title: className + " Vehicles",
            grid,
            classificationId: classification_id, // Pass classificationId to view
        });
    } catch (error) {
        console.error("Error in buildByClassificationId:", error);
        next(error);  
    }
};

// Display details of a specific inventory item
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const classificationId = req.query.classificationId;  // Get classificationId from query parameters

    try {
        const data = await invModel.getInventoryById(inv_id);
        if (!data || data.length === 0) {
            throw new Error("Inventory item not found");
        }

        const grid = await utilities.buildInventoryDetail(data); // Process grid, if necessary
        const item = data[0]; // The actual inventory item

        // Pass classificationId along with other data to the view
        baseController.renderView(req, res, "inventory/inventorydetail", {
            title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`,
            inv_year: item.inv_year,
            inv_make: item.inv_make,
            inv_model: item.inv_model,
            inv_description: item.inv_description,
            inv_image: item.inv_image,
            inv_price: item.inv_price,
            inv_miles: item.inv_miles,
            inv_color: item.inv_color,
            grid,
            classificationId,  // Pass classificationId to the view
        });
    } catch (error) {
        console.error("Error in buildByInventoryId:", error);
        next(error);  
    }
};

module.exports = invCont;
