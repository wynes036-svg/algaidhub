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
          <div key={movie.id} className="flw-item" onClick={() => navigate(`/watch/${movie.id}`)}>
            <div className="film-poster" style={{ position: "relative" }}>
              <img
                src={
                  movie.poster_path
                    ? `${IMG_BASE}${movie.poster_path}`
                    : "https://placehold.co/160x237/1a1a1a/555?text=No+Image"
                }
                alt={movie.title}
              />
              <div className="film-poster-overlay">
                <button
                  className="play-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.id}`); }}
                >▶</button>
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
            <div className="film-detail">
              <div className="film-name">{movie.title}</div>
              <div className="film-infor">{movie.release_date?.slice(0, 4)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
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
    alignItems: "center", justifyContent: "center", zIndex: 10,
  },
};
