import { useRef } from "react";
import MovieCard from "./MovieCard";

export default function MovieRow({ title, movies }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    rowRef.current.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  return (
    <div className="block_area">
      <div className="block_area-header">
        <h2 className="cat-heading">{title}</h2>
      </div>
      <div style={{ position: "relative" }}>
        <button className="row-scroll-btn left" onClick={() => scroll("left")}>‹</button>
        <div ref={rowRef} className="film_list-wrap">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <button className="row-scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
}
