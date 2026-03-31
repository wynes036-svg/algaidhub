import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const AVATARS = [
  "🦅", "🐦", "🐉", "🦁", "🐺", "🦊", "🎭", "👾", "🤖", "🧙", "🦸", "🎃"
];

// SVG icon components
const IconCamera = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

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

  const renderAvatar = (av, size = 20) => {
    if (av?.startsWith("/") || av?.startsWith("http")) {
      return <img src={av} alt="avatar" style={{ width: size, height: size, objectFit: "cover", borderRadius: "4px" }} />;
    }
    return <span style={{ fontSize: size * 0.9 }}>{av || "🦅"}</span>;
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <div onClick={() => setOpen(!open)} style={styles.avatar} title={user?.name}>
        {renderAvatar(user?.avatar, 32)}
      </div>

      {open && (
        <div style={styles.dropdown}>
          {/* User info */}
          <div style={styles.userInfo}>
            <div style={styles.avatarLarge}>{renderAvatar(user?.avatar, 40)}</div>
            <div>
              <div style={{ fontWeight: "600", fontSize: "15px" }}>{user?.name}</div>
              <div style={{ fontSize: "12px", color: "#888" }}>{user?.email}</div>
            </div>
          </div>

          <div style={styles.divider} />

          {/* Change avatar */}
          <div style={styles.menuItem} onClick={() => { setShowAvatarPicker(!showAvatarPicker); setShowSettings(false); }}>
            <span style={styles.menuIcon}><IconCamera /></span>
            Change Profile Icon
          </div>

          {showAvatarPicker && (
            <div style={styles.avatarGrid}>
              {AVATARS.map((a, i) => (
                <div key={i} onClick={() => { updateAvatar(a); setShowAvatarPicker(false); }}
                  style={{ ...styles.avatarOption, ...(user?.avatar === a ? styles.avatarSelected : {}) }}>
                  {renderAvatar(a, 28)}
                </div>
              ))}
            </div>
          )}

          <div style={styles.divider} />

          {/* Continue Watching */}
          <div style={styles.menuItem} onClick={() => { navigate("/continue-watching"); setOpen(false); }}>
            <span style={styles.menuIcon}><IconPlay /></span>
            Continue Watching
            {continueWatching.length > 0 && (
              <span style={styles.badge}>{continueWatching.length}</span>
            )}
          </div>

          {/* Settings */}
          <div style={styles.menuItem} onClick={() => { setShowSettings(!showSettings); setShowAvatarPicker(false); }}>
            <span style={styles.menuIcon}><IconSettings /></span>
            Settings
          </div>

          {showSettings && (
            <div style={styles.settingsPanel}>
              <div style={styles.settingRow}>
                <span style={{ fontSize: "13px", color: "#ccc" }}>Autoplay</span>
                <input type="checkbox" defaultChecked style={{ cursor: "pointer", accentColor: "#e50914" }} />
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
            <span style={{ ...styles.menuIcon, color: "#e50914" }}><IconLogout /></span>
            Sign Out
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
    cursor: "pointer", overflow: "hidden",
  },
  dropdown: {
    position: "absolute", top: "48px", right: 0,
    background: "#1a1a1a", borderRadius: "10px", minWidth: "240px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 200,
    border: "1px solid #2a2a2a", overflow: "hidden",
  },
  userInfo: { display: "flex", alignItems: "center", gap: "12px", padding: "16px" },
  avatarLarge: {
    width: "48px", height: "48px", borderRadius: "8px",
    background: "#2a2a2a", display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, overflow: "hidden",
  },
  divider: { height: "1px", background: "#2a2a2a", margin: "4px 0" },
  menuItem: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", cursor: "pointer", fontSize: "14px",
    color: "#ddd", transition: "background 0.15s",
  },
  menuIcon: { display: "flex", alignItems: "center", color: "#aaa" },
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
    justifyContent: "center", cursor: "pointer",
    border: "2px solid transparent", overflow: "hidden",
  },
  avatarSelected: { border: "2px solid #e50914" },
  settingsPanel: { padding: "8px 16px 12px" },
  settingRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "6px 0",
  },
};
