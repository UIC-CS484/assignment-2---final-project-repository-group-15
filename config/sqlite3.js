const sqlite3 = require("sqlite3").verbose();
const query = require("../config/query");
const path = require("path");
const DBSOURCE = path.join(__dirname, "../db/mock.db");

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.log("Error Location sqlite3");
    console.error(err.message);
    throw err;
  } else {
    // Database connection established
    console.log("Connected to SQLite databse.");
    // Create user table
    db.run(query.CREATE_USER_TABLE);
  }
});

module.exports.db = db;
