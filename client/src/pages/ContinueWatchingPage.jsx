import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

export default function ContinueWatchingPage() {
  const { continueWatching, removeFromContinue } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "30px 4%" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "8px" }}>
          Continue Watching
        </h1>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "30px" }}>
          Pick up where you left off
        </p>

        {continueWatching.length === 0 ? (
          <div style={{ textAlign: "center", color: "#666", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎬</div>
            <p style={{ fontSize: "18px" }}>Nothing here yet.</p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>Start watching a movie to see it here.</p>
            <button
              onClick={() => navigate("/")}
              style={{ marginTop: "24px", background: "#e50914", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "4px", cursor: "pointer", fontSize: "15px" }}
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {continueWatching.map((movie) => (
              <div key={movie.id} style={styles.card}>
                <div style={styles.posterWrap} onClick={() => navigate(`/watch/${movie.id}`)}>
                  <img
                    src={movie.backdrop_path ? `${IMG_BASE}${movie.backdrop_path}` : "https://via.placeholder.com/300x170?text=No+Image"}
                    alt={movie.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={styles.overlay}>
                    <div style={styles.playBtn}>▶</div>
                  </div>
                  {/* Progress bar */}
                  <div style={styles.progressBg}>
                    <div style={{ ...styles.progressFill, width: `${movie.percent || 0}%` }} />
                  </div>
                  <button
                    style={styles.removeBtn}
                    onClick={(e) => { e.stopPropagation(); removeFromContinue(movie.id); }}
                  >✕</button>
                </div>
                <div style={{ padding: "10px 4px 0" }}>
                  <div style={styles.title}>{movie.title}</div>
                  <div style={styles.meta}>
                    <span style={{ color: "#e50914" }}>{movie.percent || 0}% watched</span>
                    <span style={{ color: "#666", marginLeft: "8px" }}>{movie.release_date?.slice(0, 4)}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/watch/${movie.id}`)}
                    style={styles.resumeBtn}
                  >
                    ▶ Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: { cursor: "pointer" },
  posterWrap: {
    width: "100%", paddingBottom: "56.25%", position: "relative",
    borderRadius: "8px", overflow: "hidden",
  },
  overlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
  },
  playBtn: {
    width: "50px", height: "50px", borderRadius: "50%",
    background: "#e50914", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center", fontSize: "18px",
    opacity: 0, transition: "opacity 0.2s",
  },
  progressBg: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "4px", background: "rgba(255,255,255,0.2)",
  },
  progressFill: { height: "100%", background: "#e50914" },
  removeBtn: {
    position: "absolute", top: "8px", right: "8px",
    background: "rgba(0,0,0,0.7)", color: "#fff", border: "none",
    borderRadius: "50%", width: "26px", height: "26px",
    fontSize: "12px", cursor: "pointer",
  },
  title: {
    fontSize: "15px", fontWeight: "500", color: "#fff",
    marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  meta: { fontSize: "13px", marginBottom: "10px" },
  resumeBtn: {
    background: "#e50914", color: "#fff", border: "none",
    padding: "8px 20px", borderRadius: "4px", cursor: "pointer",
    fontSize: "13px", fontWeight: "600", width: "100%",
  },
};
