import { useState, useEffect } from "react";

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isTV() {
  return /SmartTV|SMART-TV|Tizen|webOS|NetCast|BRAVIA|HbbTV|CrKey|Roku|AppleTV|TV Safari/i.test(navigator.userAgent);
}

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
  const mobile = isMobile();
  const tv = isTV();

  useEffect(() => {
    if (localStorage.getItem("adblock_dismissed")) return;
    if (isTV()) return; // no banner on TVs
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
      {tv ? (
        <span style={styles.text}>
          For ad-free streaming on your TV, set your DNS to{" "}
          <a href="https://adguard-dns.io/en/public-dns.html" target="_blank" rel="noopener noreferrer" style={styles.link}>
            AdGuard DNS
          </a>
          {" "}(94.140.14.14) in your TV network settings — blocks ads on every app, no install needed.
        </span>
      ) : mobile ? (
        <span style={styles.text}>
          For the best mobile experience, use{" "}
          <a href="https://brave.com/download" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Brave Browser
          </a>
          {" "}— it has a built-in ad blocker. No redirections, no interruptions.
        </span>
      ) : (
        <span style={styles.text}>
          For the best movie experience, install{" "}
          <a
            href="https://chromewebstore.google.com/detail/ad-block-wonder/fpkbnjejghdcncegfglnapabnljcimdc"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Ad Block Wonder
          </a>
          {" "}— enjoy uninterrupted, ad-free streaming. Once installed, no more redirections.
        </span>
      )}
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
