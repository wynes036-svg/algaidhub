import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/original";
const IMG_SM = "https://image.tmdb.org/t/p/w185";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite } = useApp();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`)
      .then((r) => r.json())
      .then((data) => {
        setMovie(data);
        const yt = data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailer(yt);
        setCast(data.credits?.cast?.slice(0, 12) || []);
      });
    fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => setSimilar(d.results?.slice(0, 6) || []));
  }, [id]);

  if (!movie) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
    </div>
  );

  const favorited = isFavorite(movie.id);
  const director = movie.credits?.crew?.find((c) => c.job === "Director");

  return (
    <>
      <Navbar />
      <div id="main-wrapper">
        {/* Hero backdrop */}
        <div className="detail-cover" style={{ backgroundImage: `url(${IMG_BASE}${movie.backdrop_path})` }} />

        <div className="detail-content">
          <h1 className="detail-title">{movie.title}</h1>
          <div className="detail-meta">
            <span className="match">{Math.round(movie.vote_average * 10)}% Match</span>
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span>{movie.runtime} min</span>
            <span className="quality-badge">HD</span>
            {movie.adult && <span className="quality-badge">18+</span>}
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate(`/watch/${movie.id}`)}>▶ Play</button>
            <button className="btn-secondary" onClick={() => favorited ? removeFavorite(movie.id) : addFavorite(movie)}
              style={{ color: favorited ? "#e50914" : "#fff" }}>
              {favorited ? "♥ In My List" : "+ My List"}
            </button>
            {trailer && (
              <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="btn-secondary"
                style={{ display: "inline-flex", alignItems: "center" }}>▶ Trailer</a>
            )}
          </div>

          <p className="detail-overview">{movie.overview}</p>
          <div className="detail-genres">Genres: <span>{movie.genres?.map((g) => g.name).join(", ")}</span></div>
          {director && <div style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>Director: <span style={{ color: "#ccc" }}>{director.name}</span></div>}
        </div>

        {/* X-Ray Cast Section */}
        {cast.length > 0 && (
          <div style={styles.xray}>
            <h3 style={styles.sectionTitle}>Cast</h3>
            <div style={styles.castGrid}>
              {cast.map((person) => (
                <div key={person.id} style={styles.castCard}>
                  <div style={styles.castImg}>
                    {person.profile_path
                      ? <img src={`${IMG_SM}${person.profile_path}`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={styles.castPlaceholder}>👤</div>}
                  </div>
                  <div style={styles.castName}>{person.name}</div>
                  <div style={styles.castChar}>{person.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div style={styles.xray}>
            <h3 style={styles.sectionTitle}>More Like This</h3>
            <div style={styles.similarGrid}>
              {similar.map((m) => (
                <div key={m.id} style={styles.similarCard} onClick={() => navigate(`/movie/${m.id}`)}>
                  <img
                    src={m.backdrop_path ? `https://image.tmdb.org/t/p/w300${m.backdrop_path}` : "https://via.placeholder.com/300x170"}
                    alt={m.title}
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "6px" }}
                  />
                  <div style={{ padding: "8px 0" }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#fff" }}>{m.title}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>{m.release_date?.slice(0, 4)} • {Math.round(m.vote_average * 10)}% Match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  xray: { padding: "0 4% 40px" },
  sectionTitle: { fontSize: "20px", fontWeight: "400", marginBottom: "16px", borderLeft: "4px solid #e50914", paddingLeft: "12px" },
  castGrid: { display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" },
  castCard: { flexShrink: 0, width: "100px", textAlign: "center" },
  castImg: { width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", background: "#2a2a2a" },
  castPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" },
  castName: { fontSize: "12px", color: "#fff", fontWeight: "500", marginBottom: "2px" },
  castChar: { fontSize: "11px", color: "#888" },
  similarGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" },
  similarCard: { cursor: "pointer", borderRadius: "6px", overflow: "hidden", background: "#1a1a1a" },
};
