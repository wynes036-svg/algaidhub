import { useState, useEffect } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [visible, setVisible] = useState(false);

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;

  useEffect(() => {
    if (isInStandaloneMode) return; // already installed
    if (isIOS) {
      if (!localStorage.getItem("ios_install_dismissed")) setVisible(true);
      return;
    }
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem("ios_install_dismissed", "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setVisible(false);
    setDeferredPrompt(null);
  };

  if (!visible) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>📲</span>
      {isIOS ? (
        showIOSGuide ? (
          <span style={styles.text}>
            Tap the <strong style={{ color: "#fff" }}>Share</strong> button at the bottom of Safari, then tap{" "}
            <strong style={{ color: "#fff" }}>"Add to Home Screen"</strong> to install AlgaidHub.
          </span>
        ) : (
          <span style={styles.text}>
            Install <strong style={{ color: "#fff" }}>AlgaidHub</strong> on your home screen for a better experience.{" "}
            <span style={styles.link} onClick={() => setShowIOSGuide(true)}>How?</span>
          </span>
        )
      ) : (
        <span style={styles.text}>
          Install <strong style={{ color: "#fff" }}>AlgaidHub</strong> as an app for quick access.
        </span>
      )}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        {!isIOS && deferredPrompt && (
          <button onClick={install} style={styles.installBtn}>Install</button>
        )}
        <button onClick={dismiss} style={styles.close}>✕</button>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
    background: "#1a1a1a", border: "1px solid #3e8afa", borderRadius: "8px",
    padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
    zIndex: 9998, maxWidth: "520px", width: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
  },
  icon: { fontSize: "20px", flexShrink: 0 },
  text: { color: "#ccc", fontSize: "13px", lineHeight: "1.5", flex: 1 },
  link: { color: "#3e8afa", fontWeight: "600", cursor: "pointer", textDecoration: "underline" },
  installBtn: {
    background: "#3e8afa", color: "#fff", border: "none",
    padding: "6px 14px", borderRadius: "4px", cursor: "pointer",
    fontSize: "12px", fontWeight: "600",
  },
  close: {
    background: "transparent", border: "none", color: "#888",
    fontSize: "14px", cursor: "pointer", padding: "2px 4px",
  },
};
