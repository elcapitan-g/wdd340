
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const baseController = require("./baseController");

const invCont = {};


invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId;
    console.log("Received Classification ID: ", classification_id);  

    try {

        const data = await invModel.getInventoryByClassificationId(classification_id);
        console.log("Data from DB: ", data);  


        if (!data || data.length === 0) {
            console.log("No vehicles found for this classification.");
            return res.status(404).send("No vehicles found for this classification.");
        }


        const grid = await utilities.buildByClassificationGrid(data);
        const className = data[0].classification_name;

        baseController.renderView(req, res, "./inventory/classification", {
            title: className + " Vehicles",
            grid,
            classificationId: classification_id,  
        });
    } catch (error) {
        console.error("Error in buildByClassificationId:", error);
        next(error);  
    }
};


invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inv_id;
    const classificationId = req.query.classificationId;  
    console.log("Inventory ID: ", inv_id); 

    try {
        const data = await invModel.getInventoryById(inv_id);
        const grid = await utilities.buildInventoryDetail(data);

        const item = data[0];

        baseController.renderView(req, res, "./inventory/inventoryDetail", {
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
            classificationId, 
        });
    } catch (error) {
        console.error("Error in buildByInventoryId:", error);
        next(error);  
    }
};

module.exports = invCont;
