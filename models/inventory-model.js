const db = require("../database");


async function getClassifications() {
  return await db.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}


async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await db.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error: " + error);
  }
}


async function getInventoryByInventoryId(inventoryId) {
  try {
    const data = await db.query(
      `SELECT * FROM public.inventory
       INNER JOIN public.classification
       ON public.inventory.classification_id = public.classification.classification_id
       WHERE inv_id = $1`,
      [inventoryId]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByInventoryId error: " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
};
