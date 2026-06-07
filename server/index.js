require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const authRoutes = require("./routes/auth");
const mealRoutes = require("./routes/meals");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global DB mode flag ────────────────────────────────────────────────────
// "mongo" = MongoDB connected, "local" = JSON file fallback
global.DB_MODE = "local";

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static files (uploaded images) ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);

// Health check
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", service: "NutriSnap API", dbMode: global.DB_MODE })
);

// ── MongoDB connection ──────────────────────────────────────────────────────
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  const isPlaceholder = !uri || uri.includes("CHANGE_ME") || uri.includes("<username>");

  if (isPlaceholder) {
    console.warn("⚠️  MONGODB_URI not configured. Using local JSON file store (server/data/).");
    global.DB_MODE = "local";
    return;
  }

  try {
    await mongoose.connect(uri);
    global.DB_MODE = "mongo";
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    console.warn("   Falling back to local JSON file store (server/data/).");
    global.DB_MODE = "local";
  }
};

// ── Start server ────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    const mode = global.DB_MODE === "mongo" ? "MongoDB" : "Local JSON (server/data/)";
    console.log(`\n🚀 NutriSnap Server running on http://localhost:${PORT}`);
    console.log(`   DB mode       : ${mode}`);
    console.log(`   ML Service    : ${process.env.ML_SERVICE_URL || "http://localhost:8000"}\n`);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});
