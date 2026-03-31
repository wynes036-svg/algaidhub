import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

// Movies released within 60 days are likely cam copies, 60-120 days may still be cam/HD-rip
function getQuality(releaseDate) {
  if (!releaseDate) return { label: "HD", color: "#3e8afa" };
  const days = (Date.now() - new Date(releaseDate).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 60) return { label: "CAM", color: "#ff6b00" };
  if (days < 120) return { label: "HD-RIP", color: "#f5c518" };
  return { label: "HD", color: "#3e8afa" };
}

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const quality = getQuality(movie.release_date);

  return (
    <div className="flw-item" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="film-poster">
        <img
          src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "https://placehold.co/160x237/1a1a1a/555?text=No+Image"}
          alt={movie.title}
        />
        <div className="film-poster-overlay">
          <button
            className="play-btn"
            onClick={(e) => { e.stopPropagation(); navigate(`/watch/${movie.id}`); }}
          >▶</button>
        </div>
        {movie.vote_average > 0 && (
          <span className="pick">{movie.vote_average.toFixed(1)}</span>
        )}
        <span style={{
          position: "absolute", bottom: "8px", left: "8px",
          background: quality.color, color: "#fff",
          fontSize: "10px", fontWeight: "700", padding: "2px 6px",
          borderRadius: "3px", letterSpacing: "0.5px", zIndex: 5,
        }}>{quality.label}</span>
      </div>
      <div className="film-detail">
        <div className="film-name">{movie.title}</div>
        <div className="film-infor">{movie.release_date?.slice(0, 4)}</div>
      </div>
    </div>
  );
}
