import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Search from "./pages/Search";
import ContinueWatchingPage from "./pages/ContinueWatchingPage";
import TVDetail from "./pages/TVDetail";
import WatchTV from "./pages/WatchTV";
import LoginModal from "./components/LoginModal";
import "./index.css";

function AppRoutes() {
  const { showLoginModal } = useApp();
  return (
    <>
      {showLoginModal && <LoginModal />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/search" element={<Search />} />
        <Route path="/continue-watching" element={<ContinueWatchingPage />} />
        <Route path="/tv/:id" element={<TVDetail />} />
        <Route path="/watch/tv/:id/:season/:episode" element={<WatchTV />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<MovieDetail />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
