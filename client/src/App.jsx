import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Watch from "./pages/Watch";
import Login from "./pages/Login";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
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
