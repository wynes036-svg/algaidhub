import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import Navbar from "../components/Navbar";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

function getWatchPath(item) {
  const isTV = !!item.first_air_date || (!!item.name && !item.title);
  if (isTV) {
    const ep = JSON.parse(localStorage.getItem("epProgress") || "{}");
    const last = Object.values(ep)
      .filter((e) => e.showId === item.id)
      .sort((a, b) => b.updatedAt - a.updatedAt)[0];
    return `/watch/tv/${item.id}/${last?.season || 1}/${last?.episode || 1}`;
  }
  return `/watch/${item.id}`;
}

export default function ContinueWatchingPage() {
  const { continueWatching, removeFromContinue } = useApp();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "30px 4%" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "8px" }}>Continue Watching</h1>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "30px" }}>Pick up where you left off</p>

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
          <div className="film_list-wrap" style={{ flexWrap: "wrap" }}>
            {continueWatching.map((movie) => {
              const path = getWatchPath(movie);
              return (
                <div key={movie.id} className="flw-item" onClick={() => navigate(path)}>
                  <div className="film-poster" style={{ position: "relative" }}>
                    <img
                      src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "https://placehold.co/160x237/1a1a1a/555?text=No+Image"}
                      alt={movie.title || movie.name}
                    />
                    <div className="film-poster-overlay">
                      <button className="play-btn" onClick={(e) => { e.stopPropagation(); navigate(path); }}>▶</button>
                    </div>
                    <div style={styles.progressBg}>
                      <div style={{ ...styles.progressFill, width: `${movie.percent || 0}%` }} />
                    </div>
                    <button style={styles.removeBtn}
                      onClick={(e) => { e.stopPropagation(); removeFromContinue(movie.id); }}
                      title="Remove">✕</button>
                  </div>
                  <div className="film-detail">
                    <div className="film-name">{movie.title || movie.name}</div>
                    <div className="film-infor">{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
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
