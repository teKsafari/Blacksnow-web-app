import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://black-snow.onrender.com/api/house";

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Proxy POST requests to the Black Snow API
app.post("/api/house", async (req, res) => {
  const houseId = req.headers["x-house-id"];
  if (!houseId) {
    return res.status(400).json({ error: "Missing X-House-Id header" });
  }

  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-House-Id": houseId
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Upstream error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
