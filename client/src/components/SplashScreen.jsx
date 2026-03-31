import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function SplashScreen({ onDone }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFade(true), 1800);
    const t2 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{ ...styles.screen, opacity: fade ? 0 : 1 }}>
      <div style={styles.logoWrap}>
        <Logo size={48} />
      </div>
      <div style={styles.bar}>
        <div style={styles.barFill} />
      </div>
    </div>
  );
}

const styles = {
  screen: {
    position: "fixed", inset: 0, background: "#0a0a0a",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    zIndex: 9999, transition: "opacity 0.6s ease",
  },
  logoWrap: {
    animation: "pulse 1s ease-in-out infinite alternate",
  },
  bar: {
    width: "120px", height: "3px", background: "#222",
    borderRadius: "2px", marginTop: "40px", overflow: "hidden",
  },
  barFill: {
    height: "100%", background: "#e50914", borderRadius: "2px",
    animation: "load 1.8s ease forwards",
  },
};
