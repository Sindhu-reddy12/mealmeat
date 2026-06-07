const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const MongoMeal = require("../models/Meal");
const MongoUser = require("../models/User");
const { Meals: LocalMeals, Users: LocalUsers } = require("../utils/localStore");
const nutritionMap = require("../nutrition_map.json");

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

// ── Pick the right store based on DB_MODE ────────────────────────────────
function getMealStore() {
  return global.DB_MODE === "mongo" ? MongoMeal : LocalMeals;
}
function getUserStore() {
  return global.DB_MODE === "mongo" ? MongoUser : LocalUsers;
}

// ── Recommendation engine (rule-based) ────────────────────────────────────
function getRecommendation(food, calories, goal, healthCondition) {
  const recs = [];

  if (healthCondition === "diabetes") {
    if (["Jalebi", "Gulab Jamun", "Rasgulla", "Mango Lassi"].includes(food))
      recs.push("⚠️ High sugar content — consume in moderation with diabetes.");
    else recs.push("✅ Relatively safe option for diabetics.");
  }

  if (healthCondition === "hypertension") {
    if (["Samosa", "Vada Pav", "Chole Bhature", "Bhel Puri"].includes(food))
      recs.push("⚠️ High sodium — limit intake with hypertension.");
    else recs.push("✅ Moderate sodium — suitable for most diets.");
  }

  if (goal === "lose") {
    if (calories > 400) recs.push("🔴 High calorie meal — consider a smaller portion.");
    else if (calories < 250) recs.push("🟢 Low calorie — great choice for weight loss!");
    else recs.push("🟡 Moderate calories — fits your weight-loss goal.");
  } else if (goal === "gain") {
    if (calories > 400) recs.push("🟢 High calorie — excellent for weight gain!");
    else recs.push("💡 Add a side dish or snack to meet your calorie surplus.");
  } else {
    if (calories > 500) recs.push("🟡 High calorie — keep other meals light today.");
    else recs.push("✅ Balanced meal — good for maintaining weight.");
  }

  const nutrition = nutritionMap[food];
  if (nutrition && nutrition.protein > 20) recs.push("💪 High protein — great for muscle recovery.");
  if (nutrition && nutrition.carbs > 50) recs.push("⚡ High carbs — ideal for energy before workouts.");
  if (nutrition && nutrition.fat > 20) recs.push("🥑 High fat — consume as part of a balanced diet.");

  return recs.join(" | ") || "Enjoy your meal! Stay hydrated. 💧";
}

// ── POST /api/meals/upload ────────────────────────────────────────────────
exports.uploadMeal = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No image file uploaded." });

    const UserStore = getUserStore();
    const MealStore = getMealStore();

    const user = await Promise.resolve(UserStore.findById(req.user.id));
    if (!user) return res.status(404).json({ message: "User not found." });

    let prediction;

    if (req.body.foodName) {
      const foodNameInput = req.body.foodName;
      // try to find in nutritionMap, case-insensitive
      const foods = Object.keys(nutritionMap);
      const matchedFood = foods.find(f => f.toLowerCase() === foodNameInput.toLowerCase());
      const actualName = matchedFood || foodNameInput;
      const nutrition = matchedFood 
        ? nutritionMap[matchedFood] 
        : { calories: 350, protein: 12, carbs: 45, fat: 10 }; // Default if unknown

      prediction = { 
        food: actualName, 
        confidence: 1.0, 
        ...nutrition 
      };
    } else {
      // Call ML service
      try {
        const form = new FormData();
        form.append("image", fs.createReadStream(req.file.path), req.file.originalname);
        const mlRes = await axios.post(`${ML_URL}/predict`, form, {
          headers: form.getHeaders(),
          timeout: 15000,
        });
        prediction = mlRes.data;
      } catch (mlErr) {
        console.warn("ML service unavailable, using fallback:", mlErr.message);
        prediction = { food: "Unknown Food", confidence: 0, calories: 0, protein: 0, carbs: 0, fat: 0 };
      }
    }

    const recommendation = getRecommendation(
      prediction.food,
      prediction.calories,
      user.goal,
      user.healthCondition
    );

    const imagePath = `/uploads/${req.file.filename}`;
    const mealData = {
      userId: user._id,
      imagePath,
      foodName: prediction.food,
      calories: prediction.calories || 0,
      protein: prediction.protein || 0,
      carbs: prediction.carbs || 0,
      fat: prediction.fat || 0,
      confidence: prediction.confidence || 0,
      recommendation,
    };

    const meal = await Promise.resolve(MealStore.create(mealData));

    res.status(201).json({
      meal: {
        id: meal._id,
        imagePath: meal.imagePath,
        foodName: meal.foodName,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        confidence: meal.confidence,
        recommendation: meal.recommendation,
        createdAt: meal.createdAt,
      },
    });
  } catch (err) {
    console.error("Upload meal error:", err);
    res.status(500).json({ message: "Server error during meal upload." });
  }
};

// ── GET /api/meals/history ─────────────────────────────────────────────────
exports.getMealHistory = async (req, res) => {
  try {
    const MealStore = getMealStore();
    let meals;

    if (global.DB_MODE === "mongo") {
      meals = await MongoMeal.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      meals = LocalMeals.find({ userId: req.user.id }, { limit: 50 });
    }

    res.json({ meals });
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ message: "Server error fetching history." });
  }
};

// ── GET /api/meals/today ───────────────────────────────────────────────────
exports.getTodayMeals = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let meals;

    if (global.DB_MODE === "mongo") {
      meals = await MongoMeal.find({
        userId: req.user.id,
        createdAt: { $gte: start, $lte: end },
      }).sort({ createdAt: -1 });
    } else {
      meals = LocalMeals.find({
        userId: req.user.id,
        createdAt: { $gte: start, $lte: end },
      });
    }

    const totals = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein: acc.protein + (m.protein || 0),
        carbs: acc.carbs + (m.carbs || 0),
        fat: acc.fat + (m.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const UserStore = getUserStore();
    const user = await Promise.resolve(UserStore.findById(req.user.id));

    res.json({
      meals,
      totals,
      calorieGoal: user?.calorieGoal || 2000,
    });
  } catch (err) {
    console.error("Get today error:", err);
    res.status(500).json({ message: "Server error fetching today's meals." });
  }
};
