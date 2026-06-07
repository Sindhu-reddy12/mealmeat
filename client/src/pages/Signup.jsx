import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Leaf, Eye, EyeOff, UserPlus } from "lucide-react";

const GOALS = [
  { value: "lose", label: "🔥 Lose Weight" },
  { value: "maintain", label: "⚖️ Maintain Weight" },
  { value: "gain", label: "💪 Gain Weight" },
];

const CONDITIONS = [
  { value: "none", label: "None" },
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension" },
];

const InputGroup = ({ label, children }) => (
  <div>
    <label style={{ color: "#86efac", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
      {label}
    </label>
    {children}
  </div>
);

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    age: "", height: "", weight: "",
    goal: "maintain", healthCondition: "none",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return setError("Name, email and password are required.");
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/signup", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectStyle = {
    background: "rgba(22, 32, 22, 0.6)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "10px",
    color: "#f0fdf4",
    padding: "12px 16px",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    width: "100%",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div className="glass-card fade-in" style={{ width: "100%", maxWidth: "480px", padding: "40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            borderRadius: "12px", padding: "10px", marginBottom: "16px",
          }}>
            <Leaf size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#f0fdf4", marginBottom: "6px" }}>Create Account</h1>
          <p style={{ color: "#6a9f6a", fontSize: "14px" }}>Start your nutrition journey today</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.08)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            color: "#f87171",
            fontSize: "14px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name */}
          <InputGroup label="Full Name">
            <input type="text" name="name" value={form.name} onChange={handleChange}
              placeholder="Aryan Sharma" className="input-field" required />
          </InputGroup>

          {/* Email */}
          <InputGroup label="Email Address">
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="you@example.com" className="input-field" required />
          </InputGroup>

          {/* Password */}
          <InputGroup label="Password">
            <div style={{ position: "relative" }}>
              <input type={showPass ? "text" : "password"} name="password" value={form.password}
                onChange={handleChange} placeholder="Min 6 characters" className="input-field"
                style={{ paddingRight: "44px" }} required minLength={6} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#4b7453", cursor: "pointer",
              }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </InputGroup>

          {/* Body Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <InputGroup label="Age">
              <input type="number" name="age" value={form.age} onChange={handleChange}
                placeholder="25" className="input-field" min={10} max={100} />
            </InputGroup>
            <InputGroup label="Height (cm)">
              <input type="number" name="height" value={form.height} onChange={handleChange}
                placeholder="170" className="input-field" min={100} max={250} />
            </InputGroup>
            <InputGroup label="Weight (kg)">
              <input type="number" name="weight" value={form.weight} onChange={handleChange}
                placeholder="65" className="input-field" min={30} max={300} />
            </InputGroup>
          </div>

          {/* Goal */}
          <InputGroup label="Your Goal">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {GOALS.map((g) => (
                <button key={g.value} type="button" onClick={() => setForm(p => ({ ...p, goal: g.value }))}
                  style={{
                    padding: "10px 8px",
                    borderRadius: "8px",
                    border: form.goal === g.value ? "1px solid rgba(34, 197, 94, 0.5)" : "1px solid rgba(34, 197, 94, 0.15)",
                    background: form.goal === g.value ? "rgba(34, 197, 94, 0.1)" : "rgba(22, 32, 22, 0.6)",
                    color: form.goal === g.value ? "#22c55e" : "#86efac",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}>
                  {g.label}
                </button>
              ))}
            </div>
          </InputGroup>

          {/* Health Condition */}
          <InputGroup label="Health Condition">
            <select name="healthCondition" value={form.healthCondition} onChange={handleChange} style={selectStyle}>
              {CONDITIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </InputGroup>

          <button type="submit" className="btn-primary" disabled={loading} style={{
            marginTop: "8px",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading
              ? <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Creating account...</>
              : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#6a9f6a", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
