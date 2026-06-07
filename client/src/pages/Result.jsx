import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Flame, Beef, Wheat, Droplets, Activity, ArrowLeft, Camera } from "lucide-react";

function NutritionCard({ icon, label, value, unit, color, bgColor }) {
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${color}25`,
      borderRadius: "14px",
      padding: "20px",
      textAlign: "center",
    }}>
      <div style={{
        width: "44px", height: "44px",
        background: `${color}15`,
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 10px",
        color,
      }}>
        {icon}
      </div>
      <div style={{ fontSize: "28px", fontWeight: "800", color: "#f0fdf4" }}>
        {value}
        <span style={{ fontSize: "13px", fontWeight: "400", color: "#6a9f6a" }}>{unit}</span>
      </div>
      <div style={{ color: "#6a9f6a", fontSize: "13px", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function ConfidenceBadge({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <span style={{
      background: `${color}15`,
      border: `1px solid ${color}30`,
      color,
      borderRadius: "100px",
      padding: "4px 12px",
      fontSize: "13px",
      fontWeight: "600",
    }}>
      {pct}% confidence
    </span>
  );
}

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const meal = location.state?.meal;

  useEffect(() => {
    if (!meal) navigate("/upload");
  }, [meal, navigate]);

  if (!meal) return null;

  const imageUrl = meal.imagePath?.startsWith("/uploads") ? meal.imagePath : `/uploads/${meal.imagePath}`;

  return (
    <div className="bg-animated" style={{ minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>

        {/* Back */}
        <button onClick={() => navigate("/dashboard")} style={{
          display: "flex", alignItems: "center", gap: "6px",
          background: "none", border: "none",
          color: "#86efac", cursor: "pointer",
          fontSize: "14px", marginBottom: "24px",
        }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* Title */}
        <div className="fade-in" style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#f0fdf4" }}>Meal Analysis Results</h1>
          <p style={{ color: "#6a9f6a", fontSize: "14px", marginTop: "4px" }}>
            {new Date(meal.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium", timeStyle: "short"
            })}
          </p>
        </div>

        {/* Food image + name */}
        <div className="glass-card fade-in" style={{ padding: "20px", marginBottom: "20px" }}>
          <img
            src={imageUrl}
            alt={meal.foodName}
            style={{
              width: "100%",
              height: "240px",
              objectFit: "cover",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
            onError={e => {
              e.target.style.display = "none";
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <div style={{ color: "#6a9f6a", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                Detected Food
              </div>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#f0fdf4" }}>{meal.foodName}</h2>
            </div>
            <ConfidenceBadge value={meal.confidence} />
          </div>
        </div>

        {/* Nutrition Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }} className="fade-in">
          <div style={{ gridColumn: "1 / -1" }}>
            <NutritionCard
              icon={<Flame size={20} />}
              label="Total Calories"
              value={meal.calories}
              unit=" kcal"
              color="#f97316"
              bgColor="rgba(249, 115, 22, 0.05)"
            />
          </div>
          <NutritionCard
            icon={<Beef size={18} />}
            label="Protein"
            value={meal.protein}
            unit="g"
            color="#3b82f6"
            bgColor="rgba(59, 130, 246, 0.05)"
          />
          <NutritionCard
            icon={<Wheat size={18} />}
            label="Carbohydrates"
            value={meal.carbs}
            unit="g"
            color="#f59e0b"
            bgColor="rgba(245, 158, 11, 0.05)"
          />
          <div style={{ gridColumn: "1 / -1" }}>
            <NutritionCard
              icon={<Droplets size={18} />}
              label="Fat"
              value={meal.fat}
              unit="g"
              color="#a78bfa"
              bgColor="rgba(167, 139, 250, 0.05)"
            />
          </div>
        </div>

        {/* Recommendation */}
        {meal.recommendation && (
          <div className="glass-card fade-in" style={{
            padding: "20px",
            marginBottom: "24px",
            background: "rgba(34, 197, 94, 0.04)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Activity size={16} color="#22c55e" />
              <span style={{ color: "#22c55e", fontWeight: "700", fontSize: "14px" }}>Health Recommendation</span>
            </div>
            <p style={{ color: "#86efac", fontSize: "14px", lineHeight: "1.8" }}>
              {meal.recommendation}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/upload" className="btn-primary" style={{
            flex: 1, textAlign: "center", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            <Camera size={16} /> Analyse Another Meal
          </Link>
          <Link to="/dashboard" className="btn-secondary" style={{
            flex: 1, textAlign: "center", textDecoration: "none",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}>
            View Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
