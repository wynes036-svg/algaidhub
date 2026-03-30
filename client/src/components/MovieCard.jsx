import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/w300";

export default function MovieCard({ movie }) {
  const navigate = useNavigate();

  return (
    <div className="flw-item" onClick={() => navigate(`/movie/${movie.id}`)}>
      <div className="film-poster">
        <img
          src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "https://via.placeholder.com/160x237?text=No+Image"}
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
      </div>
      <div className="film-detail">
        <div className="film-name">{movie.title}</div>
        <div className="film-infor">{movie.release_date?.slice(0, 4)}</div>
      </div>
    </div>
  );
}
