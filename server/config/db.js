const mysql = require("mysql");

const db = mysql.createConnection({
  host: "127.0.0.1:3306",
  user: "root",
  password: "",
  database: "SoccerLeague",
});

module.exports = db;
