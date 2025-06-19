// index.js
const express = require("express");
const cors = require('cors');
const app = express();
const port = 8080;

// Middleware to parse JSON
app.use(express.json());


// allow CORS
app.use(cors());

// atau untuk kontrol yang lebih ketat:
app.use(cors({
  origin: '*', // ganti dengan 'http://localhost:3000' jika hanya untuk lokal
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// add analyzer
var analyzer = require("./analyzer/analyzer.js");

// Get all users
app.post("/analyzer", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  let currentYear = new Date().getFullYear();
  let startYear = currentYear - 10; // Default to last 5 years

  analyzer
    .getAnalyzerResult(username, startYear, currentYear)
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
