import { useNavigate } from "react-router-dom";

const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function Hero({ movie }) {
  const navigate = useNavigate();

  return (
    <div
      className="hero-section"
      style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-desc">{movie.overview?.slice(0, 180)}...</p>
        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => navigate(`/watch/${movie.id}`)}>
            ▶ Play
          </button>
          <button className="btn-secondary" onClick={() => navigate(`/movie/${movie.id}`)}>
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
}
