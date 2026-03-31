import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import ProfileMenu from "./ProfileMenu";
import Logo from "./Logo";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

export default function Navbar() {
  const { isLoggedIn, user, logout, setShowLoginModal } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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
    if (val.length < 2) { setSuggestions([]); return; }
    searchTimer.current = setTimeout(() => {
      fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${val}`)
        .then((r) => r.json())
        .then((d) => setSuggestions(d.results?.slice(0, 5) || []));
    }, 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      setSuggestions([]);
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
      setKeyword("");
    }
  };

  const goToMovie = (id) => {
    setSuggestions([]);
    setKeyword("");
    setSearchOpen(false);
    navigate(`/movie/${id}`);
  };

  return (
    <>
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div style={styles.sidebarBg} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div style={{ ...styles.sidebar, left: sidebarOpen ? 0 : "-320px", opacity: sidebarOpen ? 1 : 0 }}>
        <div style={styles.sidebarLogo}><Logo size={30} /></div>
        <nav style={styles.sidebarNav}>
          {[
            { label: "Home", href: "/" },
            { label: "Movies", href: "/movies" },
            { label: "TV Shows", href: "/tv-shows" },
            { label: "New & Popular", href: "#" },
            { label: "My List", href: "#" },
          ].map((item) => (
            <a key={item.label} href={item.href} style={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>{item.label}</a>
          ))}
        </nav>
      </div>

      {/* Header */}
      <div id="header" className={scrolled ? "scrolled" : ""}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div id="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <Logo size={30} />
          </div>
        </div>

        <nav className="header-nav">
          <a href="/" className="active">Home</a>
          <a href="/movies">Movies</a>
          <a href="/tv-shows">TV Shows</a>
          <a href="#">New & Popular</a>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {searchOpen && (
                <div style={{ position: "relative" }}>
                  <input
                    autoFocus
                    value={keyword}
                    onChange={handleKeyword}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => { setSuggestions([]); }, 300)}
                    placeholder="Search titles..."
                    style={styles.searchInput}
                  />
                  {suggestions.length > 0 && (
                    <div style={styles.suggestions}>
                      {suggestions.map((m) => (
                        <div key={m.id} style={styles.suggestionItem} onMouseDown={() => goToMovie(m.id)}>
                          <span style={{ fontWeight: 500 }}>{m.title}</span>
                          <span style={{ color: "#888", fontSize: "12px", marginLeft: "8px" }}>{m.release_date?.slice(0, 4)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button style={styles.iconBtn} onClick={() => {
                if (searchOpen && keyword.trim()) {
                  navigate(`/search?q=${encodeURIComponent(keyword.trim())}`);
                  setKeyword("");
                  setSuggestions([]);
                  setSearchOpen(false);
                } else {
                  setSearchOpen(!searchOpen);
                }
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="22" y2="22" />
                </svg>
              </button>
            </div>
          </div>

          {/* Auth */}
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
  menuBtn: {
    background: "transparent", border: "none", color: "#fff",
    fontSize: "22px", cursor: "pointer", padding: "0 4px",
  },
  sidebarBg: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 100,
  },
  sidebar: {
    position: "fixed", top: 0, bottom: 0, width: "280px",
    background: "#111", zIndex: 101, padding: "30px 20px",
    transition: "left 0.3s ease, opacity 0.3s ease", overflowY: "auto",
  },
  sidebarLogo: { fontSize: "22px", fontWeight: "700", color: "#fff", marginBottom: "30px" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: "4px" },
  sidebarLink: {
    display: "block", padding: "14px 10px", color: "#ccc",
    fontSize: "16px", borderBottom: "1px solid #222",
    transition: "color 0.2s",
  },
  searchInput: {
    height: "36px", background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "20px",
    color: "#fff", padding: "0 14px", fontSize: "13px", width: "220px", outline: "none",
  },
  suggestions: {
    position: "absolute", top: "42px", left: 0, right: 0,
    background: "#1a1a1a", borderRadius: "6px", zIndex: 200,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)", overflow: "hidden",
  },
  suggestionItem: {
    padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #2a2a2a",
    fontSize: "14px", color: "#fff", transition: "background 0.15s",
  },
  iconBtn: {
    background: "transparent", border: "none", cursor: "pointer",
    fontSize: "18px", padding: "4px",
  },
  signInBtn: {
    background: "#3e8afa", color: "#fff", border: "none",
    padding: "8px 18px", borderRadius: "4px", fontSize: "13px",
    fontWeight: "600", cursor: "pointer",
  },
};
