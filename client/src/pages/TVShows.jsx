import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w300";

const GENRES = [
  { id: "", name: "All" },
  { id: 10759, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 9648, name: "Mystery" },
  { id: 10765, name: "Sci-Fi" },
  { id: 10768, name: "War" },
  { id: 16, name: "Animation" },
];

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const genreParam = genre ? `&with_genres=${genre}` : "";
    fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}${genreParam}`)
      .then((r) => r.json())
      .then((d) => {
        setShows(d.results || []);
        setTotalPages(Math.min(d.total_pages || 1, 500));
        setLoading(false);
      });
  }, [page, genre, sortBy]);

  const handleGenre = (g) => { setGenre(g); setPage(1); };
  const handleSort = (s) => { setSortBy(s); setPage(1); };

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "30px 4%" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "24px" }}>TV Shows</h1>

        {/* Filters */}
        <div style={styles.filterBar}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Genre:</span>
            {GENRES.map((g) => (
              <button
                key={g.id}
                onClick={() => handleGenre(g.id)}
                style={{ ...styles.filterBtn, ...(genre === g.id ? styles.filterBtnActive : {}) }}
              >
                {g.name}
              </button>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sort:</span>
            {[
              { val: "popularity.desc", label: "Popular" },
              { val: "vote_average.desc", label: "Top Rated" },
              { val: "first_air_date.desc", label: "Newest" },
            ].map((s) => (
              <button
                key={s.val}
                onClick={() => handleSort(s.val)}
                style={{ ...styles.filterBtn, ...(sortBy === s.val ? styles.filterBtnActive : {}) }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
        ) : (
          <div style={styles.grid}>
            {shows.map((show) => (
              <div
                key={show.id}
                style={styles.card}
                onClick={() => navigate(`/tv/${show.id}`)}
              >
                <div style={styles.poster}>
                  <img
                    src={show.poster_path ? `${IMG_BASE}${show.poster_path}` : "https://via.placeholder.com/150x220?text=No+Image"}
                    alt={show.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={styles.overlay} />
                  {show.vote_average > 0 && (
                    <span style={styles.badge}>{show.vote_average.toFixed(1)}</span>
                  )}
                  <div style={styles.titleOverlay}>{show.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div style={styles.pagination}>
          <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(1)}>«</button>
          <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
          {[...Array(5)].map((_, i) => {
            const p = Math.max(1, page - 2) + i;
            if (p > totalPages) return null;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}
              >{p}</button>
            );
          })}
          <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
        </div>
      </div>
    </>
  );
}

const styles = {
  filterBar: { marginBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" },
  filterGroup: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" },
  filterLabel: { color: "#888", fontSize: "13px", marginRight: "4px", minWidth: "44px" },
  filterBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    padding: "6px 14px", borderRadius: "20px", cursor: "pointer", fontSize: "13px",
  },
  filterBtnActive: { background: "#e50914", color: "#fff" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "20px", marginBottom: "40px",
  },
  card: { cursor: "pointer", position: "relative" },
  poster: {
    width: "100%", paddingBottom: "148%", position: "relative",
    borderRadius: "8px", overflow: "hidden",
  },
  overlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
    transition: "background 0.2s",
  },
  badge: {
    position: "absolute", top: "8px", right: "8px",
    background: "#e50914", color: "#fff",
    fontSize: "11px", fontWeight: "700", padding: "3px 6px", borderRadius: "3px",
  },
  titleOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
    padding: "20px 8px 8px", fontSize: "12px", color: "#fff", fontWeight: "500",
  },
  title: {
    fontSize: "13px", color: "#ddd", fontWeight: "400",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  year: { fontSize: "11px", color: "#888", marginTop: "2px" },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" },
  pageBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    width: "38px", height: "38px", borderRadius: "50%",
    cursor: "pointer", fontSize: "14px",
  },
  pageBtnActive: { background: "#e50914", color: "#fff" },
};
