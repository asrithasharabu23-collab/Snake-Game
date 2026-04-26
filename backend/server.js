const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let scores = [];

// Save score
app.post("/score", (req, res) => {
    const { name, score } = req.body;
    scores.push({ name, score });

    scores.sort((a, b) => b.score - a.score);

    res.json({ message: "Saved" });
});

// Get scores
app.get("/scores", (req, res) => {
    res.json(scores);
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));