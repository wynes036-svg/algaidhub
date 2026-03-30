import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

export default function ContinueWatching() {
  const { continueWatching, removeFromContinue } = useApp();
  const navigate = useNavigate();

  if (!continueWatching.length) return null;

  return (
    <div className="block_area">
      <div className="block_area-header">
        <h2 className="cat-heading">Continue Watching</h2>
      </div>
      <div className="film_list-wrap">
        {continueWatching.map((movie) => (
          <div key={movie.id} style={styles.card}>
            <div style={styles.poster} onClick={() => navigate(`/watch/${movie.id}`)}>
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
              {/* Remove button */}
              <button
                style={styles.removeBtn}
                onClick={(e) => { e.stopPropagation(); removeFromContinue(movie.id); }}
                title="Remove"
              >✕</button>
            </div>
            <div style={{ padding: "6px 2px 0" }}>
              <div style={styles.title}>{movie.title}</div>
              <div style={styles.percent}>{movie.percent || 0}% watched</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { minWidth: "200px", flexShrink: 0, cursor: "pointer" },
  poster: {
    width: "200px", height: "112px", position: "relative",
    borderRadius: "6px", overflow: "hidden",
  },
  overlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "background 0.2s",
  },
  playBtn: {
    width: "40px", height: "40px", borderRadius: "50%",
    background: "#e50914", color: "#fff", display: "flex",
    alignItems: "center", justifyContent: "center",
    fontSize: "16px", opacity: 0, transition: "opacity 0.2s",
  },
  progressBg: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "4px", background: "rgba(255,255,255,0.2)",
  },
  progressFill: {
    height: "100%", background: "#e50914", transition: "width 0.3s",
  },
  removeBtn: {
    position: "absolute", top: "6px", right: "6px",
    background: "rgba(0,0,0,0.7)", color: "#fff", border: "none",
    borderRadius: "50%", width: "22px", height: "22px",
    fontSize: "11px", cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
  },
  title: {
    fontSize: "13px", color: "#ddd", fontWeight: "400",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    maxWidth: "200px",
  },
  percent: { fontSize: "11px", color: "#e50914", marginTop: "2px" },
};
