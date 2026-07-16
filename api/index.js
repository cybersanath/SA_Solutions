require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Load our Express routes
app.use("/api/contact", require("../backend/routes/contact"));
app.use("/api/apply", require("../backend/routes/apply"));

// Export the Express app for Vercel Serverless Function
module.exports = app;
