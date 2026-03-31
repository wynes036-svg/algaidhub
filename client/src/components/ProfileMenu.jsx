import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const AVATARS = ["🎬", "🦅", "🐉", "🦁", "🐺", "🦊", "🎭", "👾", "🤖", "🧙", "🦸", "🎃"];

export default function ProfileMenu() {
  const { user, logout, updateAvatar, continueWatching, setShowLoginModal } = useApp();
  const [open, setOpen] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
        setShowAvatarPicker(false);
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      {/* Profile button */}
      <div
        onClick={() => setOpen(!open)}
        style={styles.avatar}
        title={user?.name}
      >
        {user?.avatar?.startsWith("/") || user?.avatar?.startsWith("http")
          ? <img src={user.avatar} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
          : <span style={{ fontSize: "20px" }}>{user?.avatar || "🎬"}</span>
        }
      </div>

      {/* Dropdown */}
      {open && (
        <div style={styles.dropdown}>
          {/* User info */}
          <div style={styles.userInfo}>
            <div style={styles.avatarLarge}>
              {user?.avatar?.startsWith("/") || user?.avatar?.startsWith("http")
                ? <img src={user.avatar} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                : user?.avatar || "🎬"}
            </div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>{user?.name}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{user?.email}</div>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Change avatar */}
          <div style={styles.menuItem} onClick={() => { setShowAvatarPicker(!showAvatarPicker); setShowSettings(false); }}>
            <span>🖼️</span> Change Profile Icon
          </div>

          {showAvatarPicker && (
            <div style={styles.avatarGrid}>
              {AVATARS.map((a) => (
                <div
                  key={a}
                  onClick={() => { updateAvatar(a); setShowAvatarPicker(false); }}
                  style={{ ...styles.avatarOption, ...(user?.avatar === a ? styles.avatarSelected : {}) }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}

          <div style={styles.divider} />

          {/* Continue Watching */}
          <div style={styles.menuItem} onClick={() => { navigate("/continue-watching"); setOpen(false); }}>
            <span>▶️</span> Continue Watching
            {continueWatching.length > 0 && (
              <span style={styles.badge}>{continueWatching.length}</span>
            )}
          </div>

          {/* Settings */}
          <div style={styles.menuItem} onClick={() => { setShowSettings(!showSettings); setShowAvatarPicker(false); }}>
            <span>⚙️</span> Settings
          </div>

          {showSettings && (
            <div style={styles.settingsPanel}>
              <div style={styles.settingRow}>
                <span style={{ fontSize: "13px", color: "#ccc" }}>Autoplay</span>
                <input type="checkbox" defaultChecked style={{ cursor: "pointer" }} />
              </div>
              <div style={styles.settingRow}>
                <span style={{ fontSize: "13px", color: "#ccc" }}>Default Server</span>
                <span style={{ fontSize: "12px", color: "#e50914" }}>VidLink</span>
              </div>
            </div>
          )}

          <div style={styles.divider} />

          {/* Sign out */}
          <div style={{ ...styles.menuItem, color: "#e50914" }} onClick={() => { logout(); setOpen(false); }}>
            <span>🚪</span> Sign Out
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  avatar: {
    width: "38px", height: "38px", borderRadius: "6px",
    background: "#1a1a1a", border: "2px solid #e50914",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "border-color 0.2s",
  },
  dropdown: {
    position: "absolute", top: "48px", right: 0,
    background: "#1a1a1a", borderRadius: "10px", minWidth: "240px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 200,
    border: "1px solid #2a2a2a", overflow: "hidden",
  },
  userInfo: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "16px",
  },
  avatarLarge: {
    width: "44px", height: "44px", borderRadius: "8px",
    background: "#2a2a2a", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "24px", flexShrink: 0,
  },
  divider: { height: "1px", background: "#2a2a2a", margin: "4px 0" },
  menuItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", cursor: "pointer", fontSize: "14px",
    color: "#ddd", transition: "background 0.15s",
  },
  badge: {
    marginLeft: "auto", background: "#e50914", color: "#fff",
    borderRadius: "50%", width: "20px", height: "20px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700",
  },
  avatarGrid: {
    display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
    gap: "6px", padding: "10px 16px",
  },
  avatarOption: {
    width: "36px", height: "36px", borderRadius: "6px",
    background: "#2a2a2a", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "20px", cursor: "pointer",
    border: "2px solid transparent",
  },
  avatarSelected: { border: "2px solid #e50914" },
  settingsPanel: { padding: "8px 16px 12px" },
  settingRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "6px 0",
  },
};
