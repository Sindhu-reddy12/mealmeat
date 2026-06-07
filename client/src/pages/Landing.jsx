import { Link } from "react-router-dom";
import { Leaf, Camera, BarChart3, Zap, Shield, ChevronRight, Star } from "lucide-react";

const FEATURES = [
  { icon: <Camera size={24} />, title: "Snap Your Meal", desc: "Upload any Indian food photo and get instant nutritional insights powered by AI." },
  { icon: <BarChart3 size={24} />, title: "Track Daily Intake", desc: "Monitor calories, protein, carbs and fats across every meal of the day." },
  { icon: <Zap size={24} />, title: "Smart Recommendations", desc: "Get personalised health tips based on your goal, weight and health condition." },
  { icon: <Shield size={24} />, title: "Health-First Design", desc: "Built with diabetes, hypertension and weight management goals in mind." },
];

const FOODS = ["Biryani", "Butter Chicken", "Dal Makhani", "Paneer Tikka", "Dosa", "Chole Bhature", "Tandoori Chicken", "Palak Paneer"];

const STATS = [
  { label: "Indian dishes recognised", value: "32+" },
  { label: "Avg accuracy", value: "94%" },
  { label: "Calories tracked", value: "10K+" },
];

export default function Landing() {
  return (
    <div className="bg-animated" style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px 60px", textAlign: "center" }}>
        <div className="fade-in">
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: "100px",
            padding: "6px 16px",
            marginBottom: "32px",
          }}>
            <Star size={14} color="#22c55e" fill="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: "13px", fontWeight: "600" }}>
              AI-Powered Indian Food Recognition
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: "900",
            lineHeight: "1.1",
            marginBottom: "24px",
            color: "#f0fdf4",
          }}>
            Track Nutrition with{" "}
            <span className="gradient-text">AI Precision</span>
          </h1>

          <p style={{ fontSize: "18px", color: "#86efac", maxWidth: "560px", margin: "0 auto 40px", lineHeight: "1.7" }}>
            NutriSnap AI recognises Indian food from your photos, estimates calories and macros instantly, and helps you meet your health goals.
          </p>

          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup" className="btn-primary" style={{
              fontSize: "16px",
              padding: "14px 32px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}>
              Start Tracking Free <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn-secondary" style={{
              fontSize: "16px",
              padding: "14px 32px",
              textDecoration: "none",
            }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          marginTop: "64px",
          maxWidth: "560px",
          margin: "64px auto 0",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#22c55e" }}>{s.value}</div>
              <div style={{ fontSize: "13px", color: "#6a9f6a", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating food tags */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
          {FOODS.map((f) => (
            <span key={f} style={{
              background: "rgba(22, 32, 22, 0.8)",
              border: "1px solid rgba(34, 197, 94, 0.15)",
              borderRadius: "100px",
              padding: "8px 20px",
              fontSize: "14px",
              color: "#86efac",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <Leaf size={12} color="#22c55e" />
              {f}
            </span>
          ))}
          <span style={{ color: "#4b7453", fontSize: "14px", alignSelf: "center" }}>+ 24 more dishes</span>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <h2 style={{ textAlign: "center", fontSize: "36px", fontWeight: "800", marginBottom: "12px", color: "#f0fdf4" }}>
          Everything you need to eat <span className="gradient-text">smarter</span>
        </h2>
        <p style={{ textAlign: "center", color: "#6a9f6a", marginBottom: "48px", fontSize: "16px" }}>
          Designed specifically for Indian cuisine and dietary habits.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="glass-card" style={{ padding: "28px", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                width: "48px", height: "48px",
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#22c55e",
                marginBottom: "16px",
              }}>
                {f.icon}
              </div>
              <h3 style={{ color: "#f0fdf4", fontWeight: "700", marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "#6a9f6a", fontSize: "14px", lineHeight: "1.6" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="glass-card glow" style={{
          padding: "48px",
          textAlign: "center",
          background: "linear-gradient(135deg, rgba(22, 163, 74, 0.15), rgba(132, 204, 22, 0.08))",
        }}>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#f0fdf4", marginBottom: "12px" }}>
            Ready to snap your first meal?
          </h2>
          <p style={{ color: "#86efac", marginBottom: "28px" }}>
            Create a free account and start tracking your nutrition today.
          </p>
          <Link to="/signup" className="btn-primary" style={{
            fontSize: "16px",
            padding: "14px 36px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}>
            Get Started — It's Free <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(34, 197, 94, 0.08)",
        padding: "24px",
        textAlign: "center",
        color: "#4b7453",
        fontSize: "14px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Leaf size={14} color="#22c55e" />
          <span>NutriSnap AI — Indian Food Nutrition Tracker</span>
        </div>
      </footer>
    </div>
  );
}
