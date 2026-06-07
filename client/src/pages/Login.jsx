import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Leaf, Eye, EyeOff, LogIn } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div className="glass-card fade-in" style={{ width: "100%", maxWidth: "420px", padding: "40px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            display: "inline-flex",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            borderRadius: "12px", padding: "10px", marginBottom: "16px",
          }}>
            <Leaf size={28} color="white" />
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#f0fdf4", marginBottom: "6px" }}>Welcome back</h1>
          <p style={{ color: "#6a9f6a", fontSize: "14px" }}>Sign in to continue tracking your nutrition</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ color: "#86efac", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ color: "#86efac", fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
                className="input-field"
                style={{ paddingRight: "44px" }}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#4b7453", cursor: "pointer",
              }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{
            marginTop: "8px",
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? <><div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} /> Signing in...</> : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "#6a9f6a", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#22c55e", fontWeight: "600", textDecoration: "none" }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
