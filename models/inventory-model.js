const pool = require("../database/");


async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

async function addClassification(classification_name) {
  // ..for insertion to the database.
  const sql = `INSERT INTO public.classification (classification_name) 
    VALUES ($1)`;

  try {
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}


async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
    );
 
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}


async function getInventoryByInventoryId(inventoryId) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
        INNER JOIN public.classification
        ON public.inventory.classification_id = public.classification.classification_id
        WHERE inv_id = $1`,
      [inventoryId]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByInventoryId error" + error);
  }
}


async function addInventory(
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
) {
  const sql = `INSERT INTO public.inventory 
    ( inv_make,
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id)
      VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )`;
  try {
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.error("editInventory error. " + error);
  }
}


async function updateInventory(
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
) {
  const sql =
    "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3,  inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
  try {
    return (
      await pool.query(sql, [
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
        inv_id,
      ])
    ).rows[0];
  } catch (error) {
    console.error("addInventory error. " + error);
  }
}


async function deleteInventory(inv_id) {
  const sql = "DELETE FROM inventory WHERE inv_id = $1";
  try {
    return await pool.query(sql, [inv_id]);
  } catch (error) {
    console.error("deleteInventory error. " + error);
  }
}

async function addVehicleNote(inv_id, note_text) {
  const sql = "INSERT INTO vehicle_notes (inv_id, note_text) VALUES ($1, $2)";
  try {
    return await pool.query(sql, [inv_id, note_text]);
  } catch (error) {
    console.error("addVehicleNote error: " + error);
    throw error;
  }
}


async function getVehicleNotes(inv_id) {
  const sql = "SELECT note_text, created_at FROM vehicle_notes WHERE inv_id = $1 ORDER BY created_at DESC";
  try {
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("getVehicleNotes error: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  addVehicleNote,     
  getVehicleNotes,
};