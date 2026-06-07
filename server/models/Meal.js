const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imagePath: { type: String, required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    recommendation: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meal", MealSchema);
