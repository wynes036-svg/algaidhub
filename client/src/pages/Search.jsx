import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w92";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [input, setInput] = useState(query);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Dropdown suggestions while typing
  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    clearTimeout(timerRef.current);
    if (!val.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    timerRef.current = setTimeout(() => {
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(val)}&page=1`)
        .then((r) => r.json())
        .then((d) => {
          const items = (d.results || []).filter((r) => r.media_type !== "person").slice(0, 8);
          setSuggestions(items);
          setShowSuggestions(true);
        });
    }, 300);
  };

  const submitSearch = (q) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    setSearchParams({ q: q.trim() });
    setPage(1);
  };

  const pickSuggestion = (item) => {
    setShowSuggestions(false);
    setInput(item.title || item.name);
    const path = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    navigate(path);
  };

  // Full results grid
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

  useEffect(() => { setInput(query); }, [query]);

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "24px 4%" }}>

        {/* Search bar with dropdown */}
        <div style={{ position: "relative", marginBottom: "24px" }}>
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              autoFocus
              value={input}
              onChange={handleInput}
              onKeyDown={(e) => { if (e.key === "Enter") submitSearch(input); if (e.key === "Escape") setShowSuggestions(false); }}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search movies, TV shows..."
              style={styles.searchInput}
            />
            {input && (
              <button style={styles.clearBtn} onClick={() => { setInput(""); setSuggestions([]); setShowSuggestions(false); setSearchParams({}); }}>✕</button>
            )}
            <button style={styles.searchBtn} onClick={() => submitSearch(input)}>Search</button>
          </div>

          {/* Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={styles.dropdown}>
              {suggestions.map((item) => {
                const title = item.title || item.name;
                const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                const type = item.media_type === "tv" ? "TV" : "Movie";
                const typeColor = item.media_type === "tv" ? "#3e8afa" : "#e50914";
                return (
                  <div key={item.id} style={styles.dropItem} onMouseDown={() => pickSuggestion(item)}>
                    <img
                      src={item.poster_path ? `${IMG}${item.poster_path}` : "https://placehold.co/46x69/1a1a1a/555?text=?"}
                      alt={title}
                      style={styles.dropImg}
                    />
                    <div style={styles.dropInfo}>
                      <div style={styles.dropTitle}>{title}</div>
                      <div style={styles.dropMeta}>
                        <span style={{ ...styles.dropBadge, background: typeColor }}>{type}</span>
                        {year && <span style={styles.dropYear}>{year}</span>}
                        {item.vote_average > 0 && <span style={styles.dropRating}>⭐ {item.vote_average.toFixed(1)}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div style={styles.dropFooter} onMouseDown={() => submitSearch(input)}>
                See all results for "<strong>{input}</strong>"
              </div>
            </div>
          )}
        </div>

        {/* Result count */}
        {query && !loading && (
          <p style={styles.resultCount}>
            {totalResults > 0
              ? <><span style={{ color: "#e50914" }}>{totalResults.toLocaleString()}</span> results for "<span style={{ color: "#fff" }}>{query}</span>"</>
              : <>No results for "<span style={{ color: "#fff" }}>{query}</span>"</>}
          </p>
        )}

        {loading && <div className="loading"><div className="d1" /><div className="d2" /><div /></div>}

        {!loading && results.length > 0 && (
          <div style={styles.grid}>
            {results.map((item) => (
              <MovieCard key={item.id} movie={{ ...item, title: item.title || item.name }} mediaType={item.media_type} />
            ))}
          </div>
        )}

        {!loading && !query && (
          <div style={styles.empty}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔍</div>
            <p style={{ color: "#666", fontSize: "16px" }}>Search for a movie or TV show</p>
          </div>
        )}

        {totalPages > 1 && !loading && (
          <div style={styles.pagination}>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(1)}>«</button>
            <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {[...Array(5)].map((_, i) => {
              const p = Math.max(1, page - 2) + i;
              if (p > totalPages) return null;
              return <button key={p} onClick={() => setPage(p)} style={{ ...styles.pageBtn, ...(p === page ? styles.pageBtnActive : {}) }}>{p}</button>;
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
  searchWrap: { display: "flex", alignItems: "center", background: "#1a1a1a", border: "2px solid #333", borderRadius: "8px", padding: "0 16px", gap: "8px" },
  searchIcon: { width: "18px", height: "18px", flexShrink: 0 },
  searchInput: { flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: "16px", padding: "14px 0", fontFamily: "inherit" },
  clearBtn: { background: "transparent", border: "none", color: "#666", fontSize: "16px", cursor: "pointer" },
  searchBtn: { background: "#e50914", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer", flexShrink: 0 },
  dropdown: { position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", zIndex: 500, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.7)" },
  dropItem: { display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #222", transition: "background 0.15s" },
  dropImg: { width: "36px", height: "54px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 },
  dropInfo: { flex: 1, minWidth: 0 },
  dropTitle: { fontSize: "14px", color: "#fff", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  dropMeta: { display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" },
  dropBadge: { fontSize: "10px", fontWeight: "700", padding: "1px 5px", borderRadius: "3px", color: "#fff" },
  dropYear: { fontSize: "12px", color: "#888" },
  dropRating: { fontSize: "12px", color: "#f5c518" },
  dropFooter: { padding: "10px 14px", fontSize: "13px", color: "#e50914", cursor: "pointer", textAlign: "center", background: "#111" },
  resultCount: { color: "#888", fontSize: "13px", marginBottom: "20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px", marginBottom: "40px" },
  empty: { textAlign: "center", padding: "80px 0" },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap", marginBottom: "40px" },
  pageBtn: { background: "#2a2a2a", color: "#ccc", border: "none", width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" },
  pageBtnActive: { background: "#e50914", color: "#fff" },
};
