import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

const GENRES = [
  { id: "", name: "All" },
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
  { id: 16, name: "Animation" },
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [genre, setGenre] = useState("");
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const genreParam = genre ? `&with_genres=${genre}` : "";
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}${genreParam}`)
      .then((r) => r.json())
      .then((d) => {
        setMovies(d.results || []);
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
        <h1 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "24px" }}>Movies</h1>

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
              { val: "release_date.desc", label: "Newest" },
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
            {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
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
  filterBtnActive: { background: "#3e8afa", color: "#fff" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px", marginBottom: "40px",
  },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" },
  pageBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    width: "38px", height: "38px", borderRadius: "50%",
    cursor: "pointer", fontSize: "14px",
  },
  pageBtnActive: { background: "#3e8afa", color: "#fff" },
};
