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
  const [hero, setHero] = useState(null);

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
        setHero(results[0].movies[Math.floor(Math.random() * 5)]);
      }
    };
    fetchAll();
    const interval = setInterval(fetchAll, 30 * 60 * 1000); // refresh every 30 min
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navbar />
      <div id="main-wrapper">
        {hero && <Hero movie={hero} />}
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
