const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};


invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);

  let grid;
  let className;
  if (data.length) {
    grid = await utilities.buildClassificationGrid(data);
    className = data[0].classification_name;
  } else {
    grid = "";
    className = "No";
  }

  const nav = await utilities.getNav();

  res.render("inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inventoryId = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventoryId);
  const listing = await utilities.buildItemListing(data[0]);
  const nav = await utilities.getNav();
  const itemName = `${data[0].inv_make} ${data[0].inv_model}`;

  res.render("inventory/inventoryDetail", {
    title: itemName,
    nav,
    listing,
  });
};

invCont.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    errors: null,
    nav,
    classificationSelect,
  });
};

invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();
  res.render("inventory/addClassification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: "", //
  });
};

invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body;
  const response = await invModel.addClassification(classification_name);
  const nav = await utilities.getNav();

  if (response) {
    req.flash("notice", `The "${classification_name}" classification was successfully added.`);
    const classificationSelect = await utilities.buildClassificationList(); 
    res.render("inventory/management", {
      title: "Vehicle Management",
      errors: null,
      nav,
      classificationSelect, 
    });
  } else {
    req.flash("notice", `Failed to add ${classification_name}`);
    res.render("inventory/addClassification", {
      title: "Add New Classification",
      errors: null,
      nav,
      classification_name,
    });
  }
};


invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classifications = await utilities.buildClassificationList();

  res.render("inventory/addInventory", {
    title: "Add Vehicle",
    errors: null,
    nav,
    classifications,
  });
};


invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash("notice", `The ${inv_year} ${inv_make} ${inv_model} successfully added.`);
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    res.render("inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    });
  } else {
    req.flash("notice", "Failed to add the vehicle. Please check your input and try again.");
    const classifications = await utilities.buildClassificationList(classification_id);
    res.render("inventory/addInventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};


invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

invCont.buildEditInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();
  const inventoryData = (await invModel.getInventoryByInventoryId(inventory_id))[0];
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;
  const classifications = await utilities.buildClassificationList(inventoryData.classification_id);

  res.render("inventory/editInventory", {
    title: "Edit " + name,
    errors: null,
    nav,
    classifications,
    ...inventoryData
  });
};

invCont.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const response = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (response) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classifications = await utilities.buildClassificationList(classification_id);
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/editInventory", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      errors: null,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

invCont.buildDeleteInventory = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventoryId);
  const nav = await utilities.getNav();
  const inventoryData = (await invModel.getInventoryByInventoryId(inventory_id))[0];
  const name = `${inventoryData.inv_make} ${inventoryData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + name,
    errors: null,
    nav,
    inv_id: inventoryData.inv_id,
    inv_make: inventoryData.inv_make,
    inv_model: inventoryData.inv_model,
    inv_year: inventoryData.inv_year,
    inv_price: inventoryData.inv_price,
  });
};

invCont.deleteInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = parseInt(req.body.inv_id);
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const queryResponse = await invModel.deleteInventory(inventory_id);
  const itemName = `${inv_make} ${inv_model}`;

  if (queryResponse) {
    req.flash("notice", `The ${itemName} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.status(501).render("inventory/deleteInventory", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: inventory_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};
// --- Vehicle Notes ---

// Add a vehicle note (POST)
invCont.addVehicleNote = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inventoryId);
    const { note_text } = req.body;

    const response = await invModel.addVehicleNote(inventoryId, note_text);

    if (response) {
      req.flash("notice", "Note added successfully.");
    } else {
      req.flash("notice", "Failed to add note.");
    }
    res.redirect(`/inv/${inventoryId}`);
  } catch (error) {
    console.error("addVehicleNote error:", error);
    next(error);
  }
};

// Get vehicle notes as JSON (GET)
invCont.getVehicleNotes = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inventoryId);
    const notes = await invModel.getVehicleNotes(inventoryId);
    res.json(notes);
  } catch (error) {
    console.error("getVehicleNotes error:", error);
    next(error);
  }
};

module.exports = invCont;
