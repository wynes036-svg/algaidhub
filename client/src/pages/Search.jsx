import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";
  const [input, setInput] = useState(query);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  // Live search as user types
  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (val.trim()) {
        setSearchParams({ q: val.trim() });
        setPage(1);
      } else {
        setResults([]);
        setTotalResults(0);
      }
    }, 400);
  };

  useEffect(() => {
    if (!query) { setResults([]); return; }
    setLoading(true);
    fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setResults(d.results?.filter((r) => r.media_type !== "person") || []);
        setTotalPages(Math.min(d.total_pages || 1, 500));
        setTotalResults(d.total_results || 0);
        setLoading(false);
      });
  }, [query, page]);

  // Sync input if query changes externally (e.g. navbar search)
  useEffect(() => { setInput(query); }, [query]);

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "24px 4%" }}>

        {/* Search bar */}
        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          <input
            autoFocus
            value={input}
            onChange={handleInput}
            placeholder="Search movies, TV shows..."
            style={styles.searchInput}
          />
          {input && (
            <button style={styles.clearBtn} onClick={() => { setInput(""); setResults([]); setSearchParams({}); }}>✕</button>
          )}
        </div>

        {/* Result count */}
        {query && !loading && (
          <p style={styles.resultCount}>
            {totalResults > 0
              ? <><span style={{ color: "#e50914" }}>{totalResults.toLocaleString()}</span> results for "<span style={{ color: "#fff" }}>{query}</span>"</>
              : <>No results for "<span style={{ color: "#fff" }}>{query}</span>"</>
            }
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
        )}

        {/* Results grid */}
        {!loading && results.length > 0 && (
          <div style={styles.grid}>
            {results.map((item) => (
              <MovieCard
                key={item.id}
                movie={{ ...item, title: item.title || item.name }}
                mediaType={item.media_type}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !query && (
          <div style={styles.empty}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <p style={{ color: "#666", fontSize: "16px" }}>Search for a movie or TV show</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
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
  searchWrap: {
    position: "relative", display: "flex", alignItems: "center",
    background: "#1a1a1a", border: "2px solid #333", borderRadius: "8px",
    padding: "0 16px", marginBottom: "20px", transition: "border-color 0.2s",
  },
  searchIcon: { width: "18px", height: "18px", flexShrink: 0, marginRight: "10px" },
  searchInput: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#fff", fontSize: "16px", padding: "14px 0", fontFamily: "inherit",
  },
  clearBtn: {
    background: "transparent", border: "none", color: "#666",
    fontSize: "16px", cursor: "pointer", padding: "4px 0 4px 8px",
  },
  resultCount: { color: "#888", fontSize: "13px", marginBottom: "20px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px", marginBottom: "40px",
  },
  empty: { textAlign: "center", padding: "80px 0" },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginBottom: "40px" },
  pageBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", fontSize: "14px",
  },
  pageBtnActive: { background: "#e50914", color: "#fff" },
};
