const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();

const PORT = 3002;

/**
 * If getting error connecting with the mysql database, make sure to
 * change the password in the db.js file to your mysql password
 * and make sure to create a database called "SoccerLeague"
 *
 * mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
 * mysql> FLUSH PRIVILEGES;
 */

app.use(cors());
app.use(express.json());

// Connect to database
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected to: ", db.config.database);
});

// Get all the tables available
app.get("/api/getTableNames", (req, res) => {
  const sql = `
    SELECT table_name as Tables
    FROM information_schema.tables
    WHERE table_schema = '${db.config.database}';
  `;
  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    }
  });
});

// Get all Table Data for a specific table
app.get("/api/getTable/:id", (req, res) => {
  const tableName = req.params.id;
  const sql = `SELECT * FROM ${tableName};`;
  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Drop a row from a table
app.delete("/api/deleteRows/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const ids = req.body.ids;
  const sql = `
    DELETE FROM ${tableName}
    WHERE Id IN (${ids.join(",")});
  `;
  console.log(sql);

  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      console.log(res);
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Add a row to a table
app.post("/api/addRow/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const { data } = req.body;
  const sql = `
    INSERT INTO ${tableName} (${Object.keys(data).join(", ")})
    VALUES (${Object.values(data)
      .map((value) => `'${value}'`)
      .join(", ")});
  `;

  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Search for a row in a table
app.get("/api/search/:tableName/:columns/:search", (req, res) => {
  const tableName = req.params.tableName;
  const columns = req.params.columns.split(",");
  const search = req.params.search;

  const sql = `
    SELECT * FROM ${tableName}
    WHERE ${columns
      .map((column) => `${column} LIKE '%${search}%'`)
      .join(" OR ")};
  `;

  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello from the server");
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
