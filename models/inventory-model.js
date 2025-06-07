const pool = require("../database/");

async function getClassifications() {
    try {
        const data = await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
        return data.rows;
    } catch (error) {
        console.error("getClassifications error:", error);
        return [];
    }
}

async function getInventories() {
    try {
        const data = await pool.query("SELECT * FROM public.inventory ORDER BY inv_make");
        return data.rows;
    } catch (error) {
        console.error("getInventories error:", error);
        return [];
    }
}

async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * 
             FROM public.inventory AS i
             JOIN public.classification AS c 
             ON i.classification_id = c.classification_id
             WHERE i.classification_id = $1`,
            [classification_id] 
        );
        return data.rows;
    } catch (error) {
        console.error(`getInventoryByClassificationId error: ${error}`);
        return [];
    }
}

async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            'SELECT * FROM public.inventory WHERE inv_id = $1',
            [inv_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getInventoryById error:", error);
        return [];
    }
}

module.exports = { getClassifications, getInventories, getInventoryByClassificationId, getInventoryById };
