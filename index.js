const express = require("express");
const con = require("./database_conection"); // PgSQL connection
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("✅ API working");
});

// Products API
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  con.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Failed to fetch products" });
    }

    // ✅ Send only the rows as array
    res.json(result.rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
