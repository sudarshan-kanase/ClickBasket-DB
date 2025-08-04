const express = require("express");
const con = require("./database_conection"); // PgSQL connection
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
////////////////////////////////////register/////////////////////////////////////////////////////
app.get("/users", async (req, res) => {
  try {
    const result = await con.query("SELECT * FROM users");
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: 500, error: err.message });
  }
});
/////////////////////////////////////post/////////////////////////////////////////////////////
app.post("/api/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const checkUser = await con.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await con.query(
      "INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4)",
      [name, email, mobile, password]
    );
    res.json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/////////////////////////////////login/////////////////////////////////////////////////////
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await con.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Login successful", user: result.rows[0] });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});
// Contact form API
const nodemailer = require("nodemailer");
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // use App Password if 2FA enabled
      },
    });

    const mailOptions = {
      from: email,
      to: "kanasesudarshan@gmail.com",
      subject: `New Contact Form - ${name}`,
      text: `
From: ${name}
Email: ${email}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, error: "Email sending failed." });
  }
});
app.post("/api/orders", async (req, res) => {
  const { name, mobile, address, total, items } = req.body;

  if (!name || !mobile || !address || !total || !items) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const result = await con.query(
      "INSERT INTO orders (name, mobile, address, total, items) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, mobile, address, total, JSON.stringify(items)]
    );

    res.status(201).json({ message: "Order placed successfully", order: result.rows[0] });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
