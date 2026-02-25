import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://black-snow.onrender.com/api/house";

app.use(cors());
app.use(express.json());

// Serve static files from the pages/ folder (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "pages")));

// ── FRONTEND ROUTE ──────────────────────────────────────────
// Serve the main HTML UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

// ── HEALTH CHECK ────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ── API PROXY ───────────────────────────────────────────────
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
        "X-House-Id": houseId,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Upstream error", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
