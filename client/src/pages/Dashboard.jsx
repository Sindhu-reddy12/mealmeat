import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  Beef, Wheat, Droplets, Clock, Camera, TrendingUp, Leaf, Scale, Activity
} from "lucide-react";

// ── BMI Calculator ──────────────────────────────────────────────────────────
function calcBMI(weight, height) {
  if (!weight || !height) return null;
  return (weight / Math.pow(height / 100, 2)).toFixed(1);
}

function getBMICategory(bmi) {
  if (!bmi) return null;
  const b = parseFloat(bmi);
  if (b < 18.5) return { label: "Underweight", color: "#f59e0b" };
  if (b < 25)   return { label: "Normal weight", color: "#22c55e" };
  if (b < 30)   return { label: "Overweight", color: "#f97316" };
  return         { label: "Obese", color: "#ef4444" };
}

// ── Components ──────────────────────────────────────────────────────────────
function MacroCard({ icon, label, value, color }) {
  return (
    <div className="glass-card" style={{ padding: "20px", textAlign: "center" }}>
      <div style={{
        width: "40px", height: "40px",
        background: `${color}15`,
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 10px", color,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "24px", fontWeight: "800", color: "#f0fdf4" }}>
        {value}<span style={{ fontSize: "14px", fontWeight: "400", color: "#6a9f6a" }}>g</span>
      </div>
      <div style={{ color: "#6a9f6a", fontSize: "13px" }}>{label}</div>
    </div>
  );
}

function MealCard({ meal }) {
  const imageUrl = meal.imagePath?.startsWith("/uploads") ? meal.imagePath : `/uploads/${meal.imagePath}`;
  return (
    <div className="glass-card" style={{
      display: "flex", gap: "16px", padding: "16px", alignItems: "center",
      transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateX(0)"}
    >
      <img src={imageUrl} alt={meal.foodName} style={{
        width: "64px", height: "64px", borderRadius: "10px",
        objectFit: "cover", border: "1px solid rgba(34, 197, 94, 0.15)", flexShrink: 0,
      }} onError={e => { e.target.style.display = "none"; }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: "700", color: "#f0fdf4", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {meal.foodName}
        </div>
        <div style={{ display: "flex", gap: "12px", marginTop: "4px", flexWrap: "wrap" }}>
          <span style={{ color: "#f97316", fontSize: "13px", fontWeight: "600" }}>🔥 {meal.calories} kcal</span>
          <span style={{ color: "#3b82f6", fontSize: "13px" }}>P: {meal.protein}g</span>
          <span style={{ color: "#f59e0b", fontSize: "13px" }}>C: {meal.carbs}g</span>
          <span style={{ color: "#a78bfa", fontSize: "13px" }}>F: {meal.fat}g</span>
        </div>
      </div>
      <div style={{ color: "#4b7453", fontSize: "12px", whiteSpace: "nowrap" }}>
        <Clock size={12} style={{ display: "inline", marginRight: "4px" }} />
        {new Date(meal.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </div>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const [todayData, setTodayData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        api.get("/meals/today"),
        api.get("/meals/history"),
      ]);
      setTodayData(todayRes.data);
      setHistory(historyRes.data.meals || []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Calorie goal: prefer API response → localStorage user → default
  const calorieGoal = todayData?.calorieGoal || user?.calorieGoal || 2000;
  const consumed = todayData?.totals?.calories || 0;
  const remaining = Math.max(0, calorieGoal - consumed);
  const progressPct = Math.min(100, (consumed / calorieGoal) * 100);
  const isOverGoal = consumed > calorieGoal;

  // BMI from stored profile
  const bmi = calcBMI(user?.weight, user?.height);
  const bmiCat = getBMICategory(bmi);

  const goalLabel = { lose: "🔥 Weight Loss", gain: "💪 Weight Gain", maintain: "⚖️ Maintenance" };

  return (
    <div className="bg-animated" style={{ minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div className="fade-in" style={{ marginBottom: "28px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f0fdf4" }}>
            Good {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p style={{ color: "#6a9f6a", marginTop: "4px" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Profile stats row */}
        {(bmi || user?.goal) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "24px" }} className="fade-in">
            {bmi && (
              <div className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Scale size={18} color={bmiCat?.color || "#22c55e"} />
                <div>
                  <div style={{ fontSize: "11px", color: "#4b7453", textTransform: "uppercase", letterSpacing: "0.06em" }}>BMI</div>
                  <div style={{ fontWeight: "700", color: bmiCat?.color || "#f0fdf4", fontSize: "16px" }}>
                    {bmi} <span style={{ fontSize: "11px", fontWeight: "400", color: "#6a9f6a" }}>({bmiCat?.label})</span>
                  </div>
                </div>
              </div>
            )}
            {user?.weight && (
              <div className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <Activity size={18} color="#86efac" />
                <div>
                  <div style={{ fontSize: "11px", color: "#4b7453", textTransform: "uppercase", letterSpacing: "0.06em" }}>Weight</div>
                  <div style={{ fontWeight: "700", color: "#f0fdf4", fontSize: "16px" }}>{user.weight} kg</div>
                </div>
              </div>
            )}
            {user?.goal && (
              <div className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <TrendingUp size={18} color="#22c55e" />
                <div>
                  <div style={{ fontSize: "11px", color: "#4b7453", textTransform: "uppercase", letterSpacing: "0.06em" }}>Goal</div>
                  <div style={{ fontWeight: "700", color: "#22c55e", fontSize: "14px" }}>{goalLabel[user.goal] || user.goal}</div>
                </div>
              </div>
            )}
            <div className="glass-card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "18px" }}>🎯</div>
              <div>
                <div style={{ fontSize: "11px", color: "#4b7453", textTransform: "uppercase", letterSpacing: "0.06em" }}>Daily Target</div>
                <div style={{ fontWeight: "700", color: "#22c55e", fontSize: "16px" }}>{calorieGoal} kcal</div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px" }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Daily Summary Card */}
            <div className="glass-card fade-in" style={{ padding: "28px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <TrendingUp size={18} color="#22c55e" />
                    <h2 style={{ color: "#86efac", fontSize: "14px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Calories Consumed Today
                    </h2>
                  </div>
                  <div style={{ fontSize: "52px", fontWeight: "900", color: isOverGoal ? "#f97316" : "#f0fdf4", lineHeight: 1 }}>
                    {consumed}
                    <span style={{ fontSize: "18px", fontWeight: "400", color: "#6a9f6a" }}> kcal</span>
                  </div>
                  {isOverGoal && (
                    <div style={{ color: "#f97316", fontSize: "13px", marginTop: "4px" }}>
                      ⚠️ {consumed - calorieGoal} kcal over your goal
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#6a9f6a", fontSize: "13px" }}>Daily Calorie Goal</div>
                  <div style={{ fontSize: "26px", fontWeight: "700", color: "#22c55e" }}>{calorieGoal} kcal</div>
                  <div style={{
                    color: isOverGoal ? "#f97316" : remaining < 200 ? "#f59e0b" : "#86efac",
                    fontSize: "13px", marginTop: "2px"
                  }}>
                    {isOverGoal ? "🔴 Goal exceeded" : remaining < 200 ? "🟡 Almost at goal" : `${remaining} kcal remaining`}
                  </div>
                  <div style={{ color: "#4b7453", fontSize: "11px", marginTop: "4px" }}>
                    Based on your BMI & {user?.goal || "maintain"} goal
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="progress-bar" style={{ marginTop: "20px" }}>
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(progressPct, 100)}%`,
                    background: isOverGoal
                      ? "linear-gradient(90deg, #f97316, #ef4444)"
                      : "linear-gradient(90deg, #16a34a, #22c55e)",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                <span style={{ color: "#4b7453", fontSize: "12px" }}>0</span>
                <span style={{ color: isOverGoal ? "#f97316" : "#4b7453", fontSize: "12px" }}>
                  {Math.round(progressPct)}% of {calorieGoal} kcal goal
                </span>
                <span style={{ color: "#4b7453", fontSize: "12px" }}>{calorieGoal}</span>
              </div>
            </div>

            {/* Macro Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
              <MacroCard icon={<Beef size={18} />} label="Protein" value={todayData?.totals?.protein || 0} color="#3b82f6" />
              <MacroCard icon={<Wheat size={18} />} label="Carbs"   value={todayData?.totals?.carbs || 0}   color="#f59e0b" />
              <MacroCard icon={<Droplets size={18} />} label="Fat"  value={todayData?.totals?.fat || 0}     color="#a78bfa" />
            </div>

            {/* Today's meals */}
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h2 style={{ color: "#f0fdf4", fontSize: "18px", fontWeight: "700" }}>Today's Meals</h2>
                <Link to="/upload" className="btn-primary" style={{
                  fontSize: "13px", padding: "8px 16px", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: "6px",
                }}>
                  <Camera size={14} /> Add Meal
                </Link>
              </div>

              {!todayData?.meals?.length ? (
                <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
                  <Leaf size={40} color="#22c55e" style={{ margin: "0 auto 12px" }} />
                  <p style={{ color: "#6a9f6a", marginBottom: "10px" }}>No meals logged today yet.</p>
                  <Link to="/upload" style={{ color: "#22c55e", textDecoration: "none", fontWeight: "600", fontSize: "14px" }}>
                    Upload your first meal →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {todayData.meals.map((m) => <MealCard key={m._id} meal={m} />)}
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div>
                <h2 style={{ color: "#f0fdf4", fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
                  Meal History
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {history.slice(0, 10).map((m) => <MealCard key={m._id} meal={m} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
