const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const MongoUser = require("../models/User");
const { Users: LocalUsers } = require("../utils/localStore");

// ── Pick the right store based on DB_MODE ────────────────────────────────
function getStore() {
  return global.DB_MODE === "mongo" ? MongoUser : LocalUsers;
}

// ── Helper: compute calorie goal from profile ─────────────────────────────
function computeCalorieGoal(weight, height, age, goal) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const tdee = Math.round(bmr * 1.55);
  if (goal === "lose") return Math.max(1200, tdee - 500);
  if (goal === "gain") return tdee + 500;
  return tdee;
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password, age, height, weight, goal, healthCondition } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    const Store = getStore();
    const existing = await Promise.resolve(Store.findOne({ email }));
    if (existing)
      return res.status(409).json({ message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const calorieGoal = computeCalorieGoal(
      Number(weight) || 65,
      Number(height) || 170,
      Number(age) || 25,
      goal || "maintain"
    );

    const userData = {
      name,
      email,
      password: hashedPassword,
      age: Number(age) || 25,
      height: Number(height) || 170,
      weight: Number(weight) || 65,
      goal: goal || "maintain",
      healthCondition: healthCondition || "none",
      calorieGoal,
    };

    const user = await Promise.resolve(Store.create(userData));

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        calorieGoal: user.calorieGoal,
        healthCondition: user.healthCondition,
        age: user.age,
        height: user.height,
        weight: user.weight,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
};

// ── POST /api/auth/login ─────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const Store = getStore();
    const user = await Promise.resolve(Store.findOne({ email }));
    if (!user)
      return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        goal: user.goal,
        calorieGoal: user.calorieGoal,
        healthCondition: user.healthCondition,
        age: user.age,
        height: user.height,
        weight: user.weight,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};
