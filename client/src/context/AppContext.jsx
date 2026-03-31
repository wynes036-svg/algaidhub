import { createContext, useContext, useState } from "react";

const AppContext = createContext();

// Watch progress helpers
const getProgress = () => JSON.parse(localStorage.getItem("watchProgress") || "{}");
const saveProgress = (movieId, data) => {
  const all = getProgress();
  all[movieId] = { ...all[movieId], ...data, updatedAt: Date.now() };
  localStorage.setItem("watchProgress", JSON.stringify(all));
};
const removeProgress = (movieId) => {
  const all = getProgress();
  delete all[movieId];
  localStorage.setItem("watchProgress", JSON.stringify(all));
};

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [continueWatching, setContinueWatching] = useState(() => {
    const p = getProgress();
    return Object.values(p).sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser({ ...userData, avatar: userData.avatar || "🎬" });
    setShowLoginModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const addFavorite = (movie) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    setFavorites((prev) =>
      prev.find((m) => m.id === movie.id) ? prev : [...prev, movie]
    );
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  };

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  const updateProgress = (movie, percent) => {
    if (percent >= 95) {
      removeProgress(movie.id);
      setContinueWatching((prev) => prev.filter((m) => m.id !== movie.id));
      return;
    }
    saveProgress(movie.id, { ...movie, percent });
    setContinueWatching(Object.values(getProgress()).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const removeFromContinue = (id) => {
    removeProgress(id);
    setContinueWatching((prev) => prev.filter((m) => m.id !== id));
  };

  const updateAvatar = (avatar) => {
    setUser((prev) => ({ ...prev, avatar }));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, user, login, logout,
      favorites, addFavorite, removeFavorite, isFavorite,
      showLoginModal, setShowLoginModal,
      continueWatching, updateProgress, removeFromContinue,
      updateAvatar,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
