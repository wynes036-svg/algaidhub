import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w92";

export default function Navbar() {
  const { isLoggedIn, setShowLoginModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const navigate = useNavigate();
  const searchTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleKeyword = (e) => {
    const val = e.target.value;
    setKeyword(val);
    clearTimeout(searchTimer.current);
    if (val.length < 2) { setSuggestions([]); setShowDrop(false); return; }
    searchTimer.current = setTimeout(() => {
      fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(val)}&page=1`)
        .then((r) => r.json())
        .then((d) => {
          const items = (d.results || []).filter((r) => r.media_type !== "person").slice(0, 6);
          setSuggestions(items);
          setShowDrop(true);
        });
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      closeDrop();
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
    if (e.key === "Escape") closeDrop();
  };

  const closeDrop = () => { setShowDrop(false); setSuggestions([]); };

  const pickItem = (item) => {
    closeDrop();
    setKeyword("");
    setSearchOpen(false);
    const path = item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`;
    navigate(path);
  };

  const goSearch = () => {
    if (keyword.trim()) {
      closeDrop();
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
      setSearchOpen(false);
    } else {
      setSearchOpen(!searchOpen);
    }
  };

  return (
    <>
      {sidebarOpen && <div style={styles.sidebarBg} onClick={() => setSidebarOpen(false)} />}

      <div style={{ ...styles.sidebar, left: sidebarOpen ? 0 : "-320px" }}>
        <div style={styles.sidebarLogo}><Logo size={30} /></div>
        <nav style={styles.sidebarNav}>
          {[
            { label: "Home", href: "/" },
            { label: "Movies", href: "/movies" },
            { label: "TV Shows", href: "/tv-shows" },
            { label: "New & Popular", href: "/new-popular" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>{item.label}</a>
          ))}
        </nav>
      </div>

      <div id="header" className={scrolled ? "scrolled" : ""}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div id="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <Logo size={30} />
          </div>
        </div>

        <nav className="header-nav">
          <a href="/">Home</a>
          <a href="/movies">Movies</a>
          <a href="/tv-shows">TV Shows</a>
          <a href="/new-popular">New & Popular</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {searchOpen && (
                <input
                  autoFocus
                  value={keyword}
                  onChange={handleKeyword}
                  onKeyDown={handleKeyDown}
                  onBlur={() => setTimeout(() => { setShowDrop(false); }, 200)}
                  onFocus={() => suggestions.length > 0 && setShowDrop(true)}
                  placeholder="Search titles..."
                  style={styles.searchInput}
                />
              )}
              <button style={styles.iconBtn} onClick={goSearch}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
            </div>

            {/* Dropdown */}
            {showDrop && suggestions.length > 0 && (
              <div style={styles.dropdown}>
                {suggestions.map((item) => {
                  const title = item.title || item.name;
                  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
                  const isTV = item.media_type === "tv";
                  return (
                    <div key={item.id} style={styles.dropItem} onMouseDown={() => pickItem(item)}>
                      <img
                        src={item.poster_path ? `${IMG}${item.poster_path}` : "https://placehold.co/36x54/1a1a1a/555?text=?"}
                        alt={title}
                        style={styles.dropImg}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.dropTitle}>{title}</div>
                        <div style={styles.dropMeta}>
                          <span style={{ ...styles.dropBadge, background: isTV ? "#3e8afa" : "#e50914" }}>{isTV ? "TV" : "Movie"}</span>
                          {year && <span style={styles.dropYear}>{year}</span>}
                          {item.vote_average > 0 && <span style={styles.dropRating}>⭐ {item.vote_average.toFixed(1)}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div style={styles.dropFooter} onMouseDown={() => { navigate(`/search?q=${encodeURIComponent(keyword)}`); setKeyword(""); setSearchOpen(false); closeDrop(); }}>
                  See all results →
                </div>
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <ProfileMenu />
          ) : (
            <button style={styles.signInBtn} onClick={() => setShowLoginModal(true)}>Sign In</button>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  menuBtn: { background: "transparent", border: "none", color: "#fff", fontSize: "22px", cursor: "pointer", padding: "0 4px" },
  sidebarBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100 },
  sidebar: { position: "fixed", top: 0, bottom: 0, width: "280px", background: "#111", zIndex: 101, padding: "30px 20px", transition: "left 0.3s ease", overflowY: "auto" },
  sidebarLogo: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "30px" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: "4px" },
  sidebarLink: { display: "block", padding: "14px 10px", color: "#ccc", fontSize: "16px", borderBottom: "1px solid #222" },
  searchInput: { height: "36px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px", color: "#fff", padding: "0 14px", fontSize: "13px", width: "220px", outline: "none" },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", padding: "4px" },
  dropdown: {
    position: "fixed", top: "65px", right: "60px", width: "320px",
    background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px",
    zIndex: 1000, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
  },
  dropItem: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #222" },
  dropImg: { width: "36px", height: "54px", objectFit: "cover", borderRadius: "3px", flexShrink: 0 },
  dropTitle: { fontSize: "13px", color: "#fff", fontWeight: "500", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  dropMeta: { display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" },
  dropBadge: { fontSize: "10px", fontWeight: "700", padding: "1px 5px", borderRadius: "3px", color: "#fff" },
  dropYear: { fontSize: "11px", color: "#888" },
  dropRating: { fontSize: "11px", color: "#f5c518" },
  dropFooter: { padding: "10px 14px", fontSize: "13px", color: "#e50914", cursor: "pointer", textAlign: "center", background: "#111" },
  signInBtn: { background: "#3e8afa", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "4px", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
};
