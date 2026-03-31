import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const IMG_BASE = "https://image.tmdb.org/t/p/w300";

export default function Top10Row() {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=1`)
      .then((r) => r.json())
      .then((d) => setMovies(d.results?.slice(0, 10) || []));
  }, []);

  const scroll = (dir) => {
    rowRef.current.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  return (
    <div className="block_area">
      <div className="block_area-header">
        <h2 className="cat-heading">Top 10 Movies Today</h2>
      </div>
      <div style={{ position: "relative" }}>
        <button className="row-scroll-btn left" onClick={() => scroll("left")}>‹</button>
        <div ref={rowRef} className="film_list-wrap">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              style={styles.card}
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Big rank number */}
              <div style={styles.rank}>{index + 1}</div>
              <div style={styles.poster}>
                <img
                  src={movie.poster_path ? `${IMG_BASE}${movie.poster_path}` : "https://via.placeholder.com/120x180"}
                  alt={movie.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                />
              </div>
            </div>
          ))}
        </div>
        <button className="row-scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex", alignItems: "flex-end", flexShrink: 0,
    cursor: "pointer", position: "relative",
  },
  rank: {
    fontSize: "120px", fontWeight: "900", lineHeight: 1,
    color: "transparent", WebkitTextStroke: "3px #333",
    marginRight: "-20px", zIndex: 1, userSelect: "none",
    fontFamily: "Arial Black, sans-serif",
  },
  poster: {
    width: "120px", height: "180px", flexShrink: 0,
    borderRadius: "6px", overflow: "hidden", zIndex: 2,
    boxShadow: "4px 0 12px rgba(0,0,0,0.5)",
  },
};
