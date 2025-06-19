// index.js
const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());
// let username = "Eru_Ikusu";

// add analyzer
var analyzer = require("./analyzer/analyzer.js");

// Get all users
app.post("/analyzer", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  analyzer
    .getAnalyzerResult(username, 2020, 2025)
    .then((analyzerResult) => {
      res.json(analyzerResult);
    })
    .catch((error) => {
      console.error("Error fetching analyzer result:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
