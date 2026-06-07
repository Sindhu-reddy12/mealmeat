const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const { uploadMeal, getMealHistory, getTodayMeals } = require("../controllers/mealController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, jpeg, png, webp)"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/upload", authMiddleware, upload.single("image"), uploadMeal);
router.get("/history", authMiddleware, getMealHistory);
router.get("/today", authMiddleware, getTodayMeals);

module.exports = router;
