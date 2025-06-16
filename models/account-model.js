const pool = require("../database");

/* -------- Register a New Account -------- */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES 
        ($1, $2, $3, $4, 'Client') 
      RETURNING *`;
    
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Registration failed: " + error.message);
  }
}

/* -------- Check If Email Exists (Optional Exclusion for Updates) -------- */
async function checkExistingEmail(account_email, excludedEmail = null) {
  try {
    let sql, values;
    if (excludedEmail) {
      sql = "SELECT 1 FROM account WHERE account_email = $1 AND account_email != $2";
      values = [account_email, excludedEmail];
    } else {
      sql = "SELECT 1 FROM account WHERE account_email = $1";
      values = [account_email];
    }

    const result = await pool.query(sql, values);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error("Email check failed: " + error.message);
  }
}

/* -------- Get Account by Email -------- */
async function getAccountByEmail(account_email) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
      FROM account 
      WHERE account_email = $1`;

    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching email found: " + error.message);
  }
}

/* -------- Get Account by ID -------- */
async function getAccountById(account_id) {
  try {
    const sql = `
      SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
      FROM account 
      WHERE account_id = $1`;

    const result = await pool.query(sql, [account_id]);
    return result.rows[0];
  } catch (error) {
    throw new Error("No matching account found: " + error.message);
  }
}

/* -------- Update Account Info -------- */
async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4
      RETURNING *`;

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Account update failed: " + error.message);
  }
}

/* -------- Update Account Password -------- */
async function updatePassword(account_id, hashed_password) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1 
      WHERE account_id = $2
      RETURNING account_id`;

    const result = await pool.query(sql, [hashed_password, account_id]);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error("Password update failed: " + error.message);
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
};
