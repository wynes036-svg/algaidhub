import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero({ movie, onPrev, onNext, total, index }) {
  const navigate = useNavigate();

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

      {/* Prev / Next arrows */}
      <button onClick={onPrev} style={styles.arrowLeft}>‹</button>
      <button onClick={onNext} style={styles.arrowRight}>›</button>

      {/* Dot indicators */}
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
    transition: "background 0.2s",
  },
  arrowRight: {
    position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
    fontSize: "36px", width: "48px", height: "48px", borderRadius: "50%",
    cursor: "pointer", zIndex: 5, display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
  },
  dots: {
    position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)",
    display: "flex", gap: "8px", zIndex: 5,
  },
  dot: {
    width: "8px", height: "8px", borderRadius: "50%",
    background: "rgba(255,255,255,0.4)", transition: "background 0.2s",
  },
  dotActive: { background: "#e50914", width: "24px", borderRadius: "4px" },
};
