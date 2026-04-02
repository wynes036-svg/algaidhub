import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useApp } from "../context/AppContext";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/original";
const IMG_SM = "https://image.tmdb.org/t/p/w185";
const IMG_W300 = "https://image.tmdb.org/t/p/w300";

export default function TVDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, isFavorite, getShowEpProgress } = useApp();
  const [show, setShow] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState([]);
  const [loadingEps, setLoadingEps] = useState(false);
  const [epProgress, setEpProgress] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,credits`)
      .then((r) => r.json())
      .then((data) => {
        setShow(data);
        const yt = data.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailer(yt);
        setCast(data.credits?.cast?.slice(0, 12) || []);
        if (data.seasons?.length) {
          const first = data.seasons.find((s) => s.season_number > 0)?.season_number || 1;
          setSelectedSeason(first);
        }
      });
  }, [id]);

  // Load episode progress
  useEffect(() => {
    const progress = getShowEpProgress(id);
    const map = {};
    progress.forEach((p) => { map[`s${p.season}e${p.episode}`] = p.percent; });
    setEpProgress(map);
  }, [id]);

  useEffect(() => {
    if (!selectedSeason) return;
    setLoadingEps(true);
    fetch(`${BASE_URL}/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => { setEpisodes(d.episodes || []); setLoadingEps(false); });
  }, [id, selectedSeason]);

  if (!show) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
    </div>
  );

  const favorited = isFavorite(show.id);
  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];

  // Find the last watched episode to resume
  const allEpProgress = getShowEpProgress(id);
  const lastWatched = allEpProgress.sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const resumeSeason = lastWatched?.season || 1;
  const resumeEpisode = lastWatched?.episode || 1;

  return (
    <>
      <Navbar />
      <div id="main-wrapper">
        <div className="detail-cover" style={{ backgroundImage: `url(${IMG_BASE}${show.backdrop_path})` }} />
        <div className="detail-content">
          <h1 className="detail-title">{show.name}</h1>
          <div className="detail-meta">
            <span className="match">{Math.round(show.vote_average * 10)}% Match</span>
            <span>{show.first_air_date?.slice(0, 4)}</span>
            <span>{show.number_of_seasons} Season{show.number_of_seasons !== 1 ? "s" : ""}</span>
            <span>{show.number_of_episodes} Episodes</span>
            <span className="quality-badge">HD</span>
          </div>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate(`/watch/tv/${show.id}/${resumeSeason}/${resumeEpisode}`)}>
              ▶ {lastWatched ? `Resume S${resumeSeason}:E${resumeEpisode}` : "Play S1:E1"}
            </button>
            <button className="btn-secondary" onClick={() => favorited ? removeFavorite(show.id) : addFavorite({ ...show, title: show.name })}
              style={{ color: favorited ? "#e50914" : "#fff" }}>
              {favorited ? "♥ In My List" : "+ My List"}
            </button>
            {trailer && (
              <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer" className="btn-secondary"
                style={{ display: "inline-flex", alignItems: "center" }}>▶ Trailer</a>
            )}
          </div>
          <p className="detail-overview">{show.overview}</p>
          <div className="detail-genres">Genres: <span>{show.genres?.map((g) => g.name).join(", ")}</span></div>
        </div>

        {/* Seasons & Episodes */}
        <div style={styles.episodesSection}>
          <div style={styles.episodesHeader}>
            <h3 style={styles.sectionTitle}>Episodes</h3>
            <div style={styles.seasonBtns}>
              {seasons.map((s) => (
                <button
                  key={s.season_number}
                  onClick={() => setSelectedSeason(s.season_number)}
                  style={{
                    ...styles.seasonBtn,
                    ...(selectedSeason === s.season_number ? styles.seasonBtnActive : {}),
                  }}
                >
                  S{s.season_number}
                </button>
              ))}
            </div>
          </div>

          {loadingEps ? (
            <div className="loading"><div className="d1" /><div className="d2" /><div /></div>
          ) : (
            <div style={styles.episodeList}>
              {episodes.map((ep) => {
                const epKey = `s${selectedSeason}e${ep.episode_number}`;
                const pct = epProgress[epKey] || 0;
                const isCurrent = lastWatched?.season === selectedSeason && lastWatched?.episode === ep.episode_number;
                return (
                  <div key={ep.id}
                    style={{ ...styles.episodeCard, ...(isCurrent ? styles.episodeCardActive : {}) }}
                    onClick={() => navigate(`/watch/tv/${show.id}/${selectedSeason}/${ep.episode_number}`)}>
                    <div style={styles.epThumb}>
                      {ep.still_path
                        ? <img src={`${IMG_W300}${ep.still_path}`} alt={ep.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={styles.epThumbPlaceholder}>▶</div>}
                      <div style={styles.epPlayOverlay}>▶</div>
                      {pct > 0 && (
                        <div style={styles.epProgressBg}>
                          <div style={{ ...styles.epProgressFill, width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                    <div style={styles.epInfo}>
                      <div style={styles.epTitle}>
                        <span style={{ color: "#888", marginRight: "8px" }}>{ep.episode_number}.</span>
                        {ep.name}
                        {isCurrent && <span style={styles.watchingBadge}>● Watching</span>}
                      </div>
                      <div style={styles.epMeta}>{ep.runtime ? `${ep.runtime} min` : ""} {ep.air_date?.slice(0, 4)}</div>
                      <p style={styles.epOverview}>{ep.overview?.slice(0, 150)}{ep.overview?.length > 150 ? "..." : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={styles.xray}>
            <h3 style={styles.sectionTitle}>Cast</h3>
            <div style={styles.castGrid}>
              {cast.map((person) => (
                <div key={person.id} style={styles.castCard}>
                  <div style={styles.castImg}>
                    {person.profile_path
                      ? <img src={`${IMG_SM}${person.profile_path}`} alt={person.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={styles.castPlaceholder}>👤</div>}
                  </div>
                  <div style={styles.castName}>{person.name}</div>
                  <div style={styles.castChar}>{person.character}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  episodesSection: { padding: "0 4% 40px" },
  episodesHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  sectionTitle: { fontSize: "20px", fontWeight: "400", borderLeft: "4px solid #e50914", paddingLeft: "12px" },
  seasonBtns: { display: "flex", gap: "8px", flexWrap: "wrap" },
  seasonBtn: { background: "#1a1a1a", color: "#e50914", border: "1px solid #333", borderRadius: "6px", padding: "8px 16px", fontSize: "14px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" },
  seasonBtnActive: { background: "#e50914", color: "#fff", border: "1px solid #e50914" },
  episodeList: { display: "flex", flexDirection: "column", gap: "2px" },
  episodeCard: { display: "flex", gap: "16px", padding: "12px", borderRadius: "6px", cursor: "pointer", background: "#111", marginBottom: "4px", transition: "background 0.2s" },
  episodeCardActive: { background: "#1a1a1a", borderLeft: "3px solid #e50914" },
  epThumb: { width: "160px", height: "90px", flexShrink: 0, borderRadius: "4px", overflow: "hidden", background: "#2a2a2a", position: "relative" },
  epThumbPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#555" },
  epPlayOverlay: { position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", color: "#fff", opacity: 0, transition: "all 0.2s" },
  epProgressBg: { position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.2)" },
  epProgressFill: { height: "100%", background: "#e50914" },
  epInfo: { flex: 1 },
  epTitle: { fontSize: "15px", fontWeight: "500", color: "#e50914", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  watchingBadge: { fontSize: "11px", color: "#e50914", background: "rgba(229,9,20,0.15)", padding: "2px 8px", borderRadius: "10px", border: "1px solid #e50914" },
  epMeta: { fontSize: "12px", color: "#e50914", marginBottom: "6px" },
  epOverview: { fontSize: "13px", color: "#aaa", lineHeight: "1.5" },
  xray: { padding: "0 4% 40px" },
  castGrid: { display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" },
  castCard: { flexShrink: 0, width: "100px", textAlign: "center" },
  castImg: { width: "80px", height: "80px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 8px", background: "#2a2a2a" },
  castPlaceholder: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" },
  castName: { fontSize: "12px", color: "#fff", fontWeight: "500", marginBottom: "2px" },
  castChar: { fontSize: "11px", color: "#888" },
};
