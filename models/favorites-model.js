const pool = require("../database");

const favoritesModel = {};

favoritesModel.addFavorite = async function(user_id, inv_id) {
  const sql = "INSERT INTO favorites (user_id, inv_id) VALUES ($1, $2) ON CONFLICT DO NOTHING";
  const values = [user_id, inv_id];
  return await pool.query(sql, values);
};

favoritesModel.removeFavorite = async function(user_id, inv_id) {
  const sql = "DELETE FROM favorites WHERE user_id = $1 AND inv_id = $2";
  const values = [user_id, inv_id];
  return await pool.query(sql, values);
};


favoritesModel.getFavoritesByUser = async function(user_id) {
  const sql = `
    SELECT inv.*
    FROM inventory inv
    JOIN favorites f ON inv.inv_id = f.inv_id
    WHERE f.user_id = $1
    ORDER BY inv.inv_make, inv.inv_model
  `;
  const values = [user_id];
  return await pool.query(sql, values);
};

favoritesModel.isFavorited = async function(user_id, inv_id) {
  const sql = "SELECT 1 FROM favorites WHERE user_id = $1 AND inv_id = $2";
  const values = [user_id, inv_id];
  const result = await pool.query(sql, values);
  return result.rowCount > 0;
};

module.exports = favoritesModel;
