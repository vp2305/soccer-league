const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  database: "soccerleague",
  user: "root",
  password: "",
});

module.exports = db;
