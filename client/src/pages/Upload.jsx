import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Upload, ImagePlus, X, Sparkles } from "lucide-react";

export default function UploadMeal() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [manualName, setManualName] = useState("");
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (jpg, png, webp).");
      return;
    }
    setFile(f);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const onInputChange = (e) => handleFile(e.target.files[0]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleUpload = async () => {
    if (!file) return setError("Please select an image first.");
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (manualName.trim()) {
        formData.append("foodName", manualName.trim());
      }
      const res = await api.post("/meals/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Pass result to Result page via state
      navigate("/result", { state: { meal: res.data.meal } });
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => { setFile(null); setPreview(null); setError(""); };

  return (
    <div className="bg-animated" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div className="fade-in" style={{ marginBottom: "32px", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#f0fdf4", marginBottom: "8px" }}>
            Analyse Your Meal
          </h1>
          <p style={{ color: "#6a9f6a" }}>Upload a clear photo of your Indian food for AI analysis</p>
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
            marginBottom: "16px",
          }}>
            {error}
          </div>
        )}

        {/* Drop zone */}
        {!preview ? (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            className="glass-card"
            style={{
              padding: "60px 32px",
              textAlign: "center",
              border: dragging
                ? "2px dashed rgba(34, 197, 94, 0.6)"
                : "2px dashed rgba(34, 197, 94, 0.2)",
              cursor: "pointer",
              background: dragging ? "rgba(34, 197, 94, 0.05)" : "rgba(22, 32, 22, 0.8)",
              transition: "all 0.2s",
              marginBottom: "16px",
            }}
            onClick={() => document.getElementById("meal-input").click()}
          >
            <div style={{
              width: "64px", height: "64px",
              background: "rgba(34, 197, 94, 0.1)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <ImagePlus size={28} color="#22c55e" />
            </div>
            <p style={{ color: "#f0fdf4", fontWeight: "600", marginBottom: "6px" }}>
              {dragging ? "Drop your image here!" : "Drag & drop your meal photo"}
            </p>
            <p style={{ color: "#4b7453", fontSize: "14px" }}>
              or click to browse — JPG, PNG, WebP up to 10MB
            </p>
            <input id="meal-input" type="file" accept="image/*" onChange={onInputChange} style={{ display: "none" }} />
          </div>
        ) : (
          <div className="glass-card" style={{ padding: "16px", marginBottom: "16px", position: "relative" }}>
            <button onClick={clearImage} style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "6px",
              color: "#f87171",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              zIndex: 1,
            }}>
              <X size={16} />
            </button>
            <img src={preview} alt="Preview" style={{
              width: "100%",
              maxHeight: "300px",
              objectFit: "contain",
              borderRadius: "10px",
            }} />
            <p style={{ color: "#86efac", fontSize: "13px", textAlign: "center", marginTop: "10px" }}>
              📸 {file?.name} — {(file?.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        {/* Manual Name Override */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", color: "#86efac", fontSize: "14px", marginBottom: "8px", fontWeight: "600" }}>
            Know what it is? Enter name (optional)
          </label>
          <input
            type="text"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            placeholder="e.g. Biryani, Dosa (leave blank for AI)"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(22, 32, 22, 0.8)",
              border: "1px solid rgba(34, 197, 94, 0.3)",
              color: "#f0fdf4",
              outline: "none",
              fontSize: "15px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="btn-primary"
          style={{
            width: "100%",
            fontSize: "16px",
            padding: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            opacity: (!file || loading) ? 0.6 : 1,
            cursor: (!file || loading) ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: "20px", height: "20px", borderWidth: "2px" }} />
              Analysing with AI...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyse Meal
            </>
          )}
        </button>

        {loading && (
          <div style={{
            background: "rgba(34, 197, 94, 0.05)",
            border: "1px solid rgba(34, 197, 94, 0.15)",
            borderRadius: "8px",
            padding: "12px",
            textAlign: "center",
            marginTop: "12px",
            color: "#86efac",
            fontSize: "13px",
          }}>
            🤖 AI is recognising your food and calculating nutrition...
          </div>
        )}
      </div>
    </div>
  );
}
