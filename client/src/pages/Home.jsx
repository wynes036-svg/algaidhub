import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import ContinueWatching from "../components/ContinueWatching";
import Top10Row from "../components/Top10Row";

const API_KEY = "72f9d7794f529cdf9668a48bff8f8015";
const BASE_URL = "https://api.themoviedb.org/3";

const categories = [
  { title: "Trending Now", endpoint: "/trending/movie/week" },
  { title: "Top Rated", endpoint: "/movie/top_rated" },
  { title: "Action", endpoint: "/discover/movie?with_genres=28" },
  { title: "Comedy", endpoint: "/discover/movie?with_genres=35" },
  { title: "Horror", endpoint: "/discover/movie?with_genres=27" },
];

export default function Home() {
  const [rows, setRows] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        categories.map((cat) => {
          const sep = cat.endpoint.includes("?") ? "&" : "?";
          return fetch(`${BASE_URL}${cat.endpoint}${sep}api_key=${API_KEY}`)
            .then((r) => r.json())
            .then((d) => ({ title: cat.title, movies: d.results || [] }));
        })
      );
      setRows(results);
      if (results[0]?.movies?.length) {
        setHeroMovies(results[0].movies.slice(0, 10));
        setHeroIndex(Math.floor(Math.random() * 5));
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const hero = heroMovies[heroIndex] || null;
  const prevHero = () => setHeroIndex((i) => (i === 0 ? heroMovies.length - 1 : i - 1));
  const nextHero = () => setHeroIndex((i) => (i === heroMovies.length - 1 ? 0 : i + 1));

  return (
    <>
      <Navbar />
      <div id="main-wrapper">
        {hero && <Hero movie={hero} onPrev={prevHero} onNext={nextHero} total={heroMovies.length} index={heroIndex} />}
        <ContinueWatching />
        <Top10Row />
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
        <footer id="footer">
          <div className="footer-logo">Algaid<span>Hub</span></div>
          <p className="footer-text">Your go-to destination for movies and TV shows. All data provided by TMDB.</p>
        </footer>
      </div>
    </>
  );
}
