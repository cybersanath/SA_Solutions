require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/contact", require("./routes/contact"));
app.use("/api/apply", require("./routes/apply"));

// Serve static frontend files from the root of the workspace
app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log(`Server running on http://0.0.0.0:${PORT}`);

});