import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/original";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useApp();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`)
      .then((r) => r.json())
      .then((data) => {
        setMovie(data);
        const yt = data.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(yt);
      });
  }, [id]);

  if (!movie) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div id="main-wrapper">
        <div
          className="detail-cover"
          style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }}
        />
        <div className="detail-content">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span className="match">{Math.round(movie.vote_average * 10)}% Match</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.runtime} min</span>
            <span className="quality-badge">HD</span>
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            <button className="btn-primary" onClick={() => navigate(`/watch/${movie.id}`)}>
              ▶ Play
            </button>
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank" rel="noreferrer"
                className="btn-secondary"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                ▶ Trailer
              </a>
            )}
            <button
              className="btn-secondary"
              onClick={() => isFavorite(movie.id) ? removeFavorite(movie.id) : addFavorite(movie)}
              style={{ color: isFavorite(movie.id) ? "#e50914" : "#fff" }}
            >
              {isFavorite(movie.id) ? "♥ Saved" : "+ My List"}
            </button>
          </div>
          <p className="detail-overview">{movie.overview}</p>
          <div className="detail-genres">
            Genres: <span>{movie.genres?.map((g) => g.name).join(", ")}</span>
          </div>
        </div>
      </div>
    </>
  );
}
