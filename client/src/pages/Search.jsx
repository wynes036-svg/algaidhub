import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setResults(d.results?.filter((r) => r.media_type !== "person") || []);
        setTotalPages(Math.min(d.total_pages || 1, 500));
        setLoading(false);
      });
  }, [query, page]);

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "30px 4%" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "300", marginBottom: "24px" }}>
          Search results for: <span style={{ color: "#e50914" }}>{query}</span>
        </h1>

        {loading ? (
          <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
        ) : results.length === 0 ? (
          <p style={{ color: "#888" }}>No results found for "{query}"</p>
        ) : (
          <div style={styles.grid}>
            {results.map((item) => (
              <MovieCard key={item.id} movie={{ ...item, title: item.title || item.name }} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {[...Array(5)].map((_, i) => {
              const p = Math.max(1, page - 2) + i;
              if (p > totalPages) return null;
              return (
                <button key={p} onClick={() => setPage(p)}
                  style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}>{p}</button>
              );
            })}
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            <button style={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px", marginBottom: "40px",
  },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" },
  pageBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", fontSize: "14px",
  },
  pageBtnActive: { background: "#e50914", color: "#fff" },
};
