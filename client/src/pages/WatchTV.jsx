import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useApp } from "../context/AppContext";
import FullscreenButton from "../components/FullscreenButton";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const SERVERS = ["VidLink", "2embed (Anime)", "VidSrc.me", "Embed.su", "AniWatch (Sub/Dub)", "YouTube Trailer"];

export default function WatchTV() {
  const { id, season, episode } = useParams();
  const navigate = useNavigate();
  const { addFavorite, isFavorite, removeFavorite, updateProgress, saveEpProgress } = useApp();
  const [show, setShow] = useState(null);
  const [imdbId, setImdbId] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [activeServer, setActiveServer] = useState(() => {
    const ua = navigator.userAgent;
    if (/Android TV|TV Safari|SmartTV|SMART-TV|Tizen|webOS|HbbTV/i.test(ua)) return 0;
    if (/Android|iPhone|iPad|iPod/i.test(ua)) return 2;
    return 0;
  });
  const [lang, setLang] = useState("sub");
  const playerRef = useRef(null);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const s = Number(season) || 1;
  const e = Number(episode) || 1;

  const isAnime = show?.genres?.some((g) => g.id === 16) || show?.origin_country?.includes("JP");
  const favorited = show && isFavorite(Number(id));

  useEffect(() => {
    fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,external_ids`)
      .then((r) => r.json())
      .then((data) => {
        setShow(data);
        setImdbId(data.external_ids?.imdb_id || null);
        const yt = data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailer(yt);
      });
  }, [id]);

  useEffect(() => {
    if (!show) return;
    const totalSeconds = (show.episode_run_time?.[0] || 45) * 60;
    clearInterval(timerRef.current);
    elapsedRef.current = 0;
    updateProgress({ ...show, title: show.name, id: Number(id) }, 1);
    timerRef.current = setInterval(() => {
      elapsedRef.current += 10;
      const percent = Math.min(Math.round((elapsedRef.current / totalSeconds) * 100), 94);
      updateProgress({ ...show, title: show.name, id: Number(id) }, percent);
      saveEpProgress(Number(id), s, e, percent);
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [activeServer, show?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    const handleKey = (ev) => {
      if (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA") return;
      if (ev.code === "Space" || ev.code === "ArrowRight" || ev.code === "ArrowLeft") ev.preventDefault();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const ALLOW = "autoplay; fullscreen; encrypted-media; picture-in-picture";

  const renderPlayer = () => {
    if (activeServer === 0)
      return <iframe key={`vl-${id}-${s}-${e}`} src={`https://vidlink.pro/tv/${id}/${s}/${e}?autoplay=true&muted=false&primaryColor=e50914`} style={styles.iframe} allowFullScreen allow={ALLOW} />;
    if (activeServer === 1) {
      const dubParam = lang === "dub" ? "&dubbing=1" : "";
      return <iframe key={`2e-${id}-${s}-${e}-${lang}`} src={`https://www.2embed.cc/embedtvfull/${id}&s=${s}&e=${e}${dubParam}`} style={styles.iframe} allowFullScreen allow={ALLOW} />;
    }
    if (activeServer === 2)
      return <iframe key={`vm-${id}-${s}-${e}`} src={`https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}&autoplay=1`} style={styles.iframe} allowFullScreen allow={ALLOW} />;
    if (activeServer === 3) {
      if (!imdbId) return <div style={styles.noVideo}><p>Not found on Embed.su</p></div>;
      return <iframe key={`es-${imdbId}-${s}-${e}`} src={`https://embed.su/embed/tv/${imdbId}/${s}/${e}`} style={styles.iframe} allowFullScreen allow={ALLOW} />;
    }
    if (activeServer === 4) {
      const dubParam = lang === "dub" ? "&dubbed=1" : "";
      return <iframe key={`aw-${id}-${s}-${e}-${lang}`} src={`https://vidsrc.to/embed/tv/${id}/${s}/${e}${dubParam}`} style={styles.iframe} allowFullScreen allow={ALLOW} />;
    }
    if (!trailer) return <div style={styles.noVideo}><p>No trailer available.</p></div>;
    return <iframe src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`} title={show?.name} style={styles.iframe} allow={ALLOW} allowFullScreen />;
  };

  return (
    <div className="watch-page" style={{ height: "100vh", overflow: "hidden" }}>
      <div className="watch-header">
        <button className="watch-back-btn" onClick={() => navigate(`/tv/${id}`)}>← Back</button>
        <span className="watch-title">{show?.name} — S{s}:E{e}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px", alignItems: "center" }}>
          <FullscreenButton targetRef={playerRef} />
          {show && (
            <button onClick={() => favorited ? removeFavorite(Number(id)) : addFavorite({ ...show, title: show.name, id: Number(id) })}
              style={{ ...styles.controlBtn, color: favorited ? "#e50914" : "#fff" }}>
              {favorited ? "♥ Saved" : "♡ My List"}
            </button>
          )}
        </div>
      </div>

      <div ref={playerRef} style={styles.playerWrap}>
        {renderPlayer()}
      </div>

      <div style={styles.serverBar}>
        <span style={styles.serverLabel}>Server:</span>
        {SERVERS.map((sv, i) => (
          <button key={sv} onClick={() => setActiveServer(i)}
            style={{ ...styles.serverBtn, ...(activeServer === i ? styles.serverBtnActive : {}) }}>
            {sv}
          </button>
        ))}
        {(isAnime || activeServer === 1 || activeServer === 4) && (
          <div style={styles.langToggle}>
            <button onClick={() => setLang("sub")} style={{ ...styles.langBtn, ...(lang === "sub" ? styles.langBtnActive : {}) }}>SUB</button>
            <button onClick={() => setLang("dub")} style={{ ...styles.langBtn, ...(lang === "dub" ? styles.langBtnActive : {}) }}>DUB</button>
          </div>
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          {e > 1 && <button style={styles.navBtn} onClick={() => navigate(`/watch/tv/${id}/${s}/${e - 1}`)}>← Prev</button>}
          <span style={{ color: "#e50914", fontSize: "12px", fontWeight: "600" }}>S{s}:E{e}</span>
          <button style={styles.navBtn} onClick={() => navigate(`/watch/tv/${id}/${s}/${e + 1}`)}>Next →</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  controlBtn: { background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  serverBar: { background: "#111", padding: "10px 12px", display: "flex", alignItems: "center", gap: "6px", overflowX: "auto", flexWrap: "nowrap", borderTop: "1px solid #1a1a1a", WebkitOverflowScrolling: "touch" },
  serverLabel: { color: "#e50914", fontSize: "12px", marginRight: "4px", fontWeight: "600", flexShrink: 0 },
  serverBtn: { background: "#2a2a2a", color: "#e50914", border: "1px solid #2a2a2a", padding: "7px 14px", borderRadius: "5px", cursor: "pointer", fontSize: "12px", flexShrink: 0, whiteSpace: "nowrap" },
  serverBtnActive: { background: "#e50914", color: "#fff", border: "1px solid #e50914" },
  navBtn: { background: "#1a1a1a", color: "#ccc", border: "1px solid #333", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  langToggle: { marginLeft: "auto", display: "flex", background: "#2a2a2a", borderRadius: "6px", overflow: "hidden", border: "1px solid #e50914", flexShrink: 0 },
  langBtn: { background: "transparent", color: "#e50914", border: "none", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  langBtnActive: { background: "#e50914", color: "#fff" },
  playerWrap: { flex: 1, position: "relative", background: "#000", overflow: "hidden", minHeight: 0 },
  iframe: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" },
  noVideo: { textAlign: "center", color: "#aaa", padding: "60px 20px", fontSize: "16px" },
  loadingOverlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 10,
  },
  spinner: {
    width: "44px", height: "44px", border: "4px solid #333",
    borderTop: "4px solid #e50914", borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
