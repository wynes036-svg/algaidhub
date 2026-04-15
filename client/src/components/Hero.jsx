import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero({ movie, onPrev, onNext, total, index }) {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(onNext, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [total]); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePrev = () => { onPrev(); startTimer(); };
  const handleNext = () => { onNext(); startTimer(); };

  return (
    <div className="hero-section" style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}>
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-desc">{movie.overview?.slice(0, 180)}...</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate(`/watch/${movie.id}`)}>▶ Play</button>
          <button className="btn-secondary" onClick={() => navigate(`/movie/${movie.id}`)}>ℹ More Info</button>
        </div>
      </div>

      <button onClick={handlePrev} style={styles.arrowLeft}>‹</button>
      <button onClick={handleNext} style={styles.arrowRight}>›</button>

      <div style={styles.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ ...styles.dot, ...(i === index ? styles.dotActive : {}) }} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  arrowLeft: {
    position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
    fontSize: "36px", width: "48px", height: "48px", borderRadius: "50%",
    cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center",
  },
  arrowRight: {
    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
    fontSize: "36px", width: "48px", height: "48px", borderRadius: "50%",
    cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center",
  },
  dots: {
    position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: "8px", zIndex: 5,
  },
  dot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "rgba(255,255,255,0.4)", transition: "all 0.3s",
    cursor: "pointer",
  },
  dotActive: { background: "#e50914", width: "24px", borderRadius: "4px" },
};
