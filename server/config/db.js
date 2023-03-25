const mysql = require("mysql");

// Create a connection to the database with the specified credentials
const db = mysql.createConnection({
  host: "localhost",
  database: "soccerleague",
  user: "root",
  password: "",
});

module.exports = db;
