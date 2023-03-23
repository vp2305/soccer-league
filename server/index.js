const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();

const PORT = 3002;

app.use(cors());
app.use(express.json());

// Route all posts to /api/posts
app.get("/api/getTables", (req, res) => {
  console.log("Getting tables");
  db.query("SELECT * FROM Coaches;", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
