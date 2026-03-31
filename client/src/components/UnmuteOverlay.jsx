import { useState } from "react";

export default function UnmuteOverlay() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={styles.overlay}>
      <button
        style={styles.btn}
        onClick={() => setDismissed(true)}
      >
        🔊 Click to Unmute
      </button>
    </div>
  );
}

const styles = {
  overlay: {
    position: "absolute", top: "16px", right: "16px",
    zIndex: 20,
  },
  btn: {
    background: "rgba(0,0,0,0.8)", color: "#fff",
    border: "2px solid #e50914", borderRadius: "6px",
    padding: "10px 18px", cursor: "pointer", fontSize: "14px",
    fontWeight: "600", backdropFilter: "blur(4px)",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};
