import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

const TABS = [
  { label: "🔥 Trending", endpoint: "/trending/all/week" },
  { label: "🆕 New Movies", endpoint: "/movie/now_playing" },
  { label: "📺 New TV Shows", endpoint: "/tv/on_the_air" },
  { label: "⭐ Top Rated", endpoint: "/movie/top_rated" },
  { label: "🎬 Coming Soon", endpoint: "/movie/upcoming" },
];

export default function NewPopular() {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const sep = TABS[activeTab].endpoint.includes("?") ? "&" : "?";
    fetch(`${BASE_URL}${TABS[activeTab].endpoint}${sep}api_key=${API_KEY}&page=${page}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.results || []);
        setTotalPages(Math.min(d.total_pages || 1, 500));
        setLoading(false);
      });
  }, [activeTab, page]);

  const handleTab = (i) => { setActiveTab(i); setPage(1); };

  return (
    <>
      <Navbar />
      <div id="main-wrapper" style={{ padding: "30px 4%" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "300", marginBottom: "24px" }}>New & Popular</h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => handleTab(i)}
              style={{ ...styles.tab, ...(activeTab === i ? styles.tabActive : {}) }}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <div key={item.id} onClick={() => navigate(item.media_type === "tv" || item.first_air_date ? `/tv/${item.id}` : `/movie/${item.id}`)}>
                <MovieCard movie={{ ...item, title: item.title || item.name }} />
              </div>
            ))}
          </div>
        )}

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
      </div>
    </>
  );
}

const styles = {
  tabs: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" },
  tab: { background: "#1a1a1a", color: "#ccc", border: "1px solid #333", padding: "10px 20px", borderRadius: "20px", cursor: "pointer", fontSize: "14px" },
  tabActive: { background: "#e50914", color: "#fff", border: "1px solid #e50914" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "20px", marginBottom: "40px" },
  pagination: { display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" },
  pageBtn: { background: "#2a2a2a", color: "#ccc", border: "none", width: "38px", height: "38px", borderRadius: "50%", cursor: "pointer", fontSize: "14px" },
  pageBtnActive: { background: "#e50914", color: "#fff" },
};
