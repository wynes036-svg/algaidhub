import { useState, useEffect } from "react";

function detectAdBlock() {
  return new Promise((resolve) => {
    const bait = document.createElement("div");
    bait.className = "ad-banner ads adsbox ad-placement";
    bait.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
    document.body.appendChild(bait);
    setTimeout(() => {
      const blocked = bait.offsetHeight === 0 || bait.offsetParent === null ||
        window.getComputedStyle(bait).display === "none" ||
        window.getComputedStyle(bait).visibility === "hidden";
      document.body.removeChild(bait);
      resolve(blocked);
    }, 100);
  });
}

export default function AdBlockBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("adblock_dismissed")) return;
    detectAdBlock().then((blocked) => {
      if (!blocked) setVisible(true);
    });
  }, []);

  const dismiss = () => {
    localStorage.setItem("adblock_dismissed", "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.banner}>
      <span style={styles.icon}>🛡️</span>
      <span style={styles.text}>
        For the best movie experience, we recommend installing{" "}
        <a
          href="https://chromewebstore.google.com/detail/ad-block-wonder/fpkbnjejghdcncegfglnapabnljcimdc"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          AdBlock Wonder
        </a>{" "}
        — enjoy uninterrupted, ad-free streaming.
      </span>
      <button onClick={dismiss} style={styles.close} title="Dismiss">✕</button>
    </div>
  );
}

const styles = {
  banner: {
    position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    background: "#1a1a1a", border: "1px solid #e50914", borderRadius: "8px",
    padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px",
    zIndex: 9999, maxWidth: "560px", width: "90%", boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
  },
  icon: { fontSize: "20px", flexShrink: 0 },
  text: { color: "#ccc", fontSize: "13px", lineHeight: "1.5", flex: 1 },
  link: { color: "#e50914", fontWeight: "600", textDecoration: "none" },
  close: {
    background: "transparent", border: "none", color: "#888",
    fontSize: "14px", cursor: "pointer", flexShrink: 0, padding: "2px 4px",
  },
};
