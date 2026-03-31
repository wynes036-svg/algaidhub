import { useState } from "react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

export default function LoginModal() {
  const { setShowLoginModal, login, API } = useApp();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); setLoading(false); return; }
      login(data.user, data.token);
    } catch {
      setError("Server error. Try again.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); setLoading(false); return; }
      login(data.user, data.token);
    } catch {
      setError("Server error. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={styles.overlay} onClick={() => setShowLoginModal(false)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.close} onClick={() => setShowLoginModal(false)}>✕</button>
        <div style={styles.logo}><Logo size={28} /></div>

        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(tab === "login" ? styles.tabActive : {}) }} onClick={() => { setTab("login"); setError(""); }}>Sign In</button>
          <button style={{ ...styles.tab, ...(tab === "register" ? styles.tabActive : {}) }} onClick={() => { setTab("register"); setError(""); }}>Register</button>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {tab === "login" ? (
          <form onSubmit={handleLogin} style={styles.form}>
            <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={styles.form}>
            <input style={styles.input} type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input style={styles.input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? "Creating account..." : "Create Account"}</button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#1a1a1a", borderRadius: "10px", padding: "40px", width: "100%", maxWidth: "400px", position: "relative", color: "#fff" },
  close: { position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#aaa", fontSize: "18px", cursor: "pointer" },
  logo: { marginBottom: "24px" },
  tabs: { display: "flex", gap: "8px", marginBottom: "20px" },
  tab: { flex: 1, padding: "10px", background: "#2a2a2a", border: "none", color: "#aaa", borderRadius: "5px", cursor: "pointer", fontSize: "14px" },
  tabActive: { background: "#e50914", color: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { height: "46px", background: "#2a2a2a", border: "1px solid #333", borderRadius: "5px", color: "#fff", padding: "0 14px", fontSize: "14px" },
  submitBtn: { height: "46px", background: "#e50914", color: "#fff", border: "none", borderRadius: "5px", fontSize: "15px", fontWeight: "600", cursor: "pointer", marginTop: "4px" },
  error: { color: "#ff4444", fontSize: "13px", marginBottom: "8px" },
};
