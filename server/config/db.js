const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  database: "SoccerLeague",
  user: "root",
  password: "",
});

module.exports = db;
