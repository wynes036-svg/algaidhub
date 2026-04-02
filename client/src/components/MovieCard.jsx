import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

// All embed servers serve HD quality when available
function getQuality(releaseDate) {
  if (!releaseDate) return { label: "HD", color: "#3e8afa" };
  const days = (Date.now() - new Date(releaseDate).getTime()) / (1000 * 60 * 60 * 24);
  if (days < 30) return { label: "CAM", color: "#ff6b00" };
  return { label: "HD", color: "#3e8afa" };
}

export default function MovieCard({ movie, mediaType }) {
  const navigate = useNavigate();
  const quality = getQuality(movie.release_date);
  const isTV = mediaType === "tv" || (!movie.release_date && movie.first_air_date);
  const detailPath = isTV ? `/tv/${movie.id}` : `/movie/${movie.id}`;
  const watchPath = isTV ? null : `/watch/${movie.id}`;

  return (
    <div className="flw-item" onClick={() => navigate(detailPath)}>
      <div className="film-poster">
        <img
          src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "https://placehold.co/160x237/1a1a1a/555?text=No+Image"}
          alt={movie.title}
        />
        <div className="film-poster-overlay">
          <button
            className="play-btn"
            onClick={(e) => { e.stopPropagation(); navigate(watchPath || detailPath); }}
          >▶</button>
        </div>
        {movie.vote_average > 0 && (
          <span className="pick">{movie.vote_average.toFixed(1)}</span>
        )}
        {!isTV && (
          <span style={{
            position: "absolute", bottom: "8px", left: "8px",
            background: quality.color, color: "#fff",
            fontSize: "10px", fontWeight: "700", padding: "2px 6px",
            borderRadius: "3px", letterSpacing: "0.5px", zIndex: 5,
          }}>{quality.label}</span>
        )}
        {isTV && (
          <span style={{
            position: "absolute", bottom: "8px", left: "8px",
            background: "#3e8afa", color: "#fff",
            fontSize: "10px", fontWeight: "700", padding: "2px 6px",
            borderRadius: "3px", letterSpacing: "0.5px", zIndex: 5,
          }}>TV</span>
        )}
      </div>
      <div className="film-detail">
        <div className="film-name">{movie.title}</div>
        <div className="film-infor">{(movie.release_date || movie.first_air_date)?.slice(0, 4)}</div>
      </div>
    </div>
  );
}
