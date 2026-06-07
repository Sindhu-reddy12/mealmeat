const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    age: { type: Number, default: 25 },
    height: { type: Number, default: 170 }, // cm
    weight: { type: Number, default: 65 },  // kg
    goal: {
      type: String,
      enum: ["lose", "gain", "maintain"],
      default: "maintain",
    },
    healthCondition: {
      type: String,
      enum: ["none", "diabetes", "hypertension"],
      default: "none",
    },
    calorieGoal: { type: Number, default: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
