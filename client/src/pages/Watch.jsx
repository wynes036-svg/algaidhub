import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useApp } from "../context/AppContext";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const VIDEO_SERVER = "http://localhost:3001";
const SERVERS = ["VidLink", "VidSrc", "VidSrc.me", "MultiEmbed", "Embed.su", "My Server", "YouTube Trailer"];

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, isFavorite, removeFavorite, updateProgress } = useApp();
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState(null);
  const [imdbId, setImdbId] = useState(null);
  const [activeServer, setActiveServer] = useState(0);
  const [lightOff, setLightOff] = useState(false);
  const [serverVideos, setServerVideos] = useState([]);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const elapsedRef = useRef(0);
  const playerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,external_ids`)
      .then((r) => r.json())
      .then((data) => {
        setMovie(data);
        setImdbId(data.external_ids?.imdb_id || null);
        const yt = data.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailer(yt);
      });
    fetch(`${VIDEO_SERVER}/videos`)
      .then((r) => r.json())
      .then((d) => setServerVideos(d.videos || []))
      .catch(() => setServerVideos([]));
  }, [id]);

  useEffect(() => {
    if (!movie) return;
    const totalSeconds = (movie.runtime || 120) * 60;
    clearInterval(timerRef.current);
    elapsedRef.current = 0;
    if (activeServer === 5) return; // My Server uses native video tracking
    updateProgress(movie, 1);
    timerRef.current = setInterval(() => {
      if (paused) return;
      elapsedRef.current += 10;
      const percent = Math.min(Math.round((elapsedRef.current / totalSeconds) * 100), 94);
      updateProgress(movie, percent);
    }, 10000);
    return () => clearInterval(timerRef.current);
  }, [activeServer, movie]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const togglePause = () => {
    if (activeServer === 3 && videoRef.current) {
      paused ? videoRef.current.play() : videoRef.current.pause();
    }
    setPaused((p) => !p);
  };

  const handleFullscreen = () => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    }
  };

  const favorited = movie && isFavorite(movie.id);
  const matchedVideo = serverVideos.find(
    (f) => f.startsWith(id) || f.toLowerCase().includes(movie?.title?.toLowerCase().slice(0, 10))
  );
  const videoUrl = matchedVideo ? `${VIDEO_SERVER}/videos/${matchedVideo}` : null;
  const isIframe = activeServer !== 3;

  return (
    <>
      {lightOff && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 98 }}
          onClick={() => setLightOff(false)}
        />
      )}
      <div className="watch-page" style={{ position: "relative", zIndex: lightOff ? 99 : 1 }}>
        <div className="watch-header">
          <button className="watch-back-btn" onClick={() => navigate(-1)}>← Back</button>
          <span className="watch-title">{movie?.title}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
            <button onClick={() => setLightOff(!lightOff)} style={styles.controlBtn}>
              {lightOff ? "💡 Light On" : "🌙 Light Off"}
            </button>
            {movie && (
              <button
                onClick={() => favorited ? removeFavorite(movie.id) : addFavorite(movie)}
                style={{ ...styles.controlBtn, color: favorited ? "#e50914" : "#fff" }}
              >
                {favorited ? "♥ Saved" : "♡ My List"}
              </button>
            )}
          </div>
        </div>

        <div style={styles.serverBar}>
          <span style={styles.serverLabel}>Server:</span>
          {SERVERS.map((s, i) => (
            <button key={s} onClick={() => { setActiveServer(i); setPaused(false); }}
              style={{ ...styles.serverBtn, ...(activeServer === i ? styles.serverBtnActive : {}) }}>
              {s}
            </button>
          ))}
        </div>

        <div className="watch-player">
          <div ref={playerRef} style={styles.playerWrap}>
            {isIframe && paused && (
              <div style={styles.pauseOverlay} onClick={togglePause}>
                <div style={styles.pauseIcon}>▶</div>
              </div>
            )}
            {activeServer === 0 ? (
              <iframe key={`vidlink-${id}`} src={`https://vidlink.pro/movie/${id}`}
                style={styles.iframe} allowFullScreen allow="autoplay; fullscreen" />
            ) : activeServer === 1 ? (
              imdbId ? (
                <iframe key={imdbId} src={`https://vidsrc.to/embed/movie/${imdbId}`}
                  style={styles.iframe} allowFullScreen allow="autoplay; fullscreen" />
              ) : (
                <div style={styles.noVideo}>
                  <p>Could not find this movie on VidSrc.</p>
                  <button style={{ ...styles.controlBtn, marginTop: "16px" }} onClick={() => setActiveServer(2)}>Try VidSrc.me</button>
                </div>
              )
            ) : activeServer === 2 ? (
              imdbId ? (
                <iframe key={`vidsrcme-${imdbId}`} src={`https://vidsrc.me/embed/movie?imdb=${imdbId}`}
                  style={styles.iframe} allowFullScreen allow="autoplay; fullscreen" />
              ) : (
                <div style={styles.noVideo}>
                  <p>Could not find this movie on VidSrc.me.</p>
                  <button style={{ ...styles.controlBtn, marginTop: "16px" }} onClick={() => setActiveServer(3)}>Try MultiEmbed</button>
                </div>
              )
            ) : activeServer === 3 ? (
              <iframe key={`multiembed-${id}`} src={`https://multiembed.mov/?video_id=${id}&tmdb=1`}
                style={styles.iframe} allowFullScreen allow="autoplay; fullscreen" />
            ) : activeServer === 4 ? (
              imdbId ? (
                <iframe key={`embedsu-${imdbId}`} src={`https://embed.su/embed/movie/${imdbId}`}
                  style={styles.iframe} allowFullScreen allow="autoplay; fullscreen" />
              ) : (
                <div style={styles.noVideo}>
                  <p>Could not find this movie on Embed.su.</p>
                  <button style={{ ...styles.controlBtn, marginTop: "16px" }} onClick={() => setActiveServer(5)}>Try My Server</button>
                </div>
              )
            ) : activeServer === 5 ? (
              videoUrl ? (
                <video ref={videoRef} key={videoUrl} controls autoPlay
                  onTimeUpdate={(e) => {
                    const { currentTime, duration } = e.target;
                    if (duration && movie) {
                      const percent = Math.round((currentTime / duration) * 100);
                      if (percent % 5 === 0) updateProgress(movie, percent);
                    }
                  }}
                  style={{ width: "100%", height: "100%", background: "#000" }}>
                  <source src={videoUrl} type="video/mp4" />
                </video>
              ) : (
                <div style={styles.noVideo}>
                  <p>🎬 No video found on your server for this movie.</p>
                  <p style={{ fontSize: "13px", color: "#666", marginTop: "8px" }}>
                    Add <code style={{ color: "#e50914" }}>{id}.mp4</code> to{" "}
                    <code style={{ color: "#e50914" }}>netflix-clone/server/videos/</code>
                  </p>
                  <button style={{ ...styles.controlBtn, marginTop: "16px" }} onClick={() => setActiveServer(6)}>Switch to YouTube</button>
                </div>
              )
            ) : (
              trailer ? (
                <iframe src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                  title={movie?.title} style={styles.iframe} allow="autoplay; fullscreen" allowFullScreen />
              ) : (
                <div style={styles.noVideo}><p>No trailer available.</p></div>
              )
            )}
          </div>
          <div style={styles.controlsBar}>
            <button style={styles.ctrlBtn} onClick={togglePause}>
              {paused ? "▶ Resume" : "⏸ Pause"}
            </button>
            <button style={styles.ctrlBtn} onClick={handleFullscreen}>
              ⛶ Fullscreen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  controlBtn: {
    background: "rgba(255,255,255,0.1)", color: "#fff", border: "none",
    padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "13px",
  },
  serverBar: {
    background: "#111", padding: "12px 24px",
    display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap",
  },
  serverLabel: { color: "#888", fontSize: "13px", marginRight: "4px" },
  serverBtn: {
    background: "#2a2a2a", color: "#ccc", border: "none",
    padding: "8px 18px", borderRadius: "5px", cursor: "pointer", fontSize: "13px",
  },
  serverBtnActive: { background: "#e50914", color: "#fff" },
  playerWrap: {
    position: "relative", width: "100%", maxWidth: "1200px",
    aspectRatio: "16/9", background: "#000", borderRadius: "8px", overflow: "hidden",
  },
  iframe: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" },
  pauseOverlay: {
    position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
    zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  pauseIcon: {
    width: "70px", height: "70px", borderRadius: "50%", background: "#e50914",
    color: "#fff", fontSize: "28px", display: "flex", alignItems: "center", justifyContent: "center",
  },
  controlsBar: { display: "flex", gap: "10px", marginTop: "12px", justifyContent: "center" },
  ctrlBtn: {
    background: "#1a1a1a", color: "#fff", border: "1px solid #333",
    padding: "10px 24px", borderRadius: "4px", cursor: "pointer",
    fontSize: "14px", fontWeight: "500",
  },
  noVideo: { textAlign: "center", color: "#aaa", padding: "60px 20px", fontSize: "16px" },
};
