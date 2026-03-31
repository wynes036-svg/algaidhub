import { useState, useEffect } from "react";

// Shows "Skip Intro" after 30s, "Skip Outro" in last 3 mins
// Since iframes block time access, we simulate with a timer
export default function SkipButton({ runtime = 120, onSkipIntro, onSkipOutro }) {
  const [showIntro, setShowIntro] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(false);
  const [outroDismissed, setOutroDismissed] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setShowIntro(false);
    setShowOutro(false);
    setIntroDismissed(false);
    setOutroDismissed(false);
    setElapsed(0);
  }, [runtime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const totalSecs = runtime * 60;
    // Show intro button between 30s - 90s
    if (elapsed >= 30 && elapsed <= 90 && !introDismissed) setShowIntro(true);
    else setShowIntro(false);
    // Show outro button in last 3 minutes
    if (elapsed >= totalSecs - 180 && elapsed <= totalSecs - 10 && !outroDismissed) setShowOutro(true);
    else if (elapsed < totalSecs - 180) setShowOutro(false);
  }, [elapsed, runtime, introDismissed, outroDismissed]);

  return (
    <>
      {showIntro && (
        <div style={styles.skipWrap}>
          <button style={styles.skipBtn} onClick={() => { setIntroDismissed(true); setShowIntro(false); onSkipIntro?.(); }}>
            Skip Intro
          </button>
          <button style={styles.watchBtn} onClick={() => { setIntroDismissed(true); setShowIntro(false); }}>
            Watch Intro
          </button>
        </div>
      )}
      {showOutro && (
        <div style={styles.skipWrap}>
          <button style={styles.skipBtn} onClick={() => { setOutroDismissed(true); setShowOutro(false); onSkipOutro?.(); }}>
            Skip Outro
          </button>
          <button style={styles.watchBtn} onClick={() => { setOutroDismissed(true); setShowOutro(false); }}>
            Watch Outro
          </button>
        </div>
      )}
    </>
  );
}

const styles = {
  skipWrap: {
    position: "absolute", bottom: "80px", right: "24px",
    display: "flex", flexDirection: "column", gap: "8px", zIndex: 20,
  },
  skipBtn: {
    background: "rgba(0,0,0,0.7)", color: "#fff",
    border: "2px solid #fff", padding: "10px 24px",
    borderRadius: "4px", cursor: "pointer", fontSize: "15px",
    fontWeight: "600", backdropFilter: "blur(4px)",
    transition: "background 0.2s",
  },
  watchBtn: {
    background: "transparent", color: "#ccc",
    border: "1px solid #666", padding: "8px 24px",
    borderRadius: "4px", cursor: "pointer", fontSize: "13px",
    backdropFilter: "blur(4px)",
  },
};
