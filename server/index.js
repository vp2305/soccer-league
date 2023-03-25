const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();

// Specify the port to run the server on
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

// Connect to database and start the server
db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected to: ", db.config.database);
});

// Get all the tables available from the connected server
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
  const sql = `SELECT * FROM ${db.config.database}.${tableName};`;
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

// Delete a table based on the table name
app.delete("/api/deleteRows/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const { ids } = req.body;
  const sql = `
    DELETE FROM ${db.config.database}.${tableName}
    WHERE Id IN (${ids.join(",")});
  `;
  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      console.log(err);
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Create a new table based on the table name and fields provided
app.post("/api/create/:tableName", (req, res) => {
  // Create a table with the fields provided in the body
  const tableName = req.params.tableName;
  const { fields } = req.body;
  // Create sql query based on the fields provided
  const sql = `
    CREATE TABLE ${db.config.database}.${tableName} (
      ${fields.map((field) => `${field.name} ${field.type}`).join(", ")}
    );
  `;

  // Execute the query
  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      console.log(err);
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Delete a table based on the table name
app.delete("/api/delete/:tableName", (req, res) => {
  // Delete a table with the name provided in the body
  const tableName = req.params.tableName;
  const sql = `DROP TABLE ${db.config.database}.${tableName};`;

  db.query(sql, (err, result) => {
    if (result) {
      res.send(result);
    } else {
      console.log(err);
      res
        .status(404)
        .json({ message: "No table found with the name: " + tableName });
    }
  });
});

// Add a row to a table based on the data provided by the user
app.post("/api/addRow/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const { data } = req.body;

  // Create sql query based on the column type and value
  const sql = `
    INSERT INTO ${db.config.database}.${tableName} (${Object.keys(data).join(
    ", "
  )})
    VALUES (${Object.values(data)
      .map((value) => {
        if (typeof value === "string") {
          return `'${value}'`;
        } else {
          return value;
        }
      })
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

// Search which rows contain the search term from all the attributes available
app.get("/api/search/:tableName/:columns/:search", (req, res) => {
  const tableName = req.params.tableName;
  const columns = req.params.columns.split(",");
  const search = req.params.search;

  const sql = `
    SELECT * FROM ${db.config.database}.${tableName}
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

// Index route to test the server
app.get("/", (req, res) => {
  res.send("Hello from the server");
});

// Start the server listening on the specified port
app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
