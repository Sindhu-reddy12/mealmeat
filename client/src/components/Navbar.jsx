import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Leaf, LayoutDashboard, Upload, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: "rgba(10, 15, 10, 0.9)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(34, 197, 94, 0.12)",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              background: "linear-gradient(135deg, #16a34a, #22c55e)",
              borderRadius: "8px",
              padding: "6px",
              display: "flex",
              alignItems: "center",
            }}>
              <Leaf size={20} color="white" />
            </div>
            <span style={{
              fontSize: "20px",
              fontWeight: "800",
              background: "linear-gradient(135deg, #22c55e, #84cc16)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              NutriSnap AI
            </span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" active={isActive("/dashboard")} icon={<LayoutDashboard size={16} />} label="Dashboard" />
                <NavLink to="/upload" active={isActive("/upload")} icon={<Upload size={16} />} label="Upload Meal" />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "8px" }}>
                  <span style={{ color: "#86efac", fontSize: "14px" }}>
                    Hi, {user?.name?.split(" ")[0]}! 👋
                  </span>
                  <button onClick={handleLogout} style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s",
                  }}>
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" style={{
                  color: "#86efac",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                }}>
                  <LogIn size={15} /> Login
                </Link>
                <Link to="/signup" className="btn-primary" style={{ fontSize: "14px", padding: "8px 18px", textDecoration: "none" }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, icon, label }) {
  return (
    <Link to={to} style={{
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 14px",
      borderRadius: "8px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500",
      color: active ? "#22c55e" : "#86efac",
      background: active ? "rgba(34, 197, 94, 0.1)" : "transparent",
      border: active ? "1px solid rgba(34, 197, 94, 0.2)" : "1px solid transparent",
      transition: "all 0.2s",
    }}>
      {icon} {label}
    </Link>
  );
}
