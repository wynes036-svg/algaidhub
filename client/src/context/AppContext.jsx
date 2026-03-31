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
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("algaid_user"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("algaid_user")); } catch { return null; }
  });
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("algaid_favorites") || "[]"); } catch { return []; }
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [continueWatching, setContinueWatching] = useState(() => {
    const p = getProgress();
    return Object.values(p).sort((a, b) => b.updatedAt - a.updatedAt);
  });

  const login = (userData) => {
    const u = { ...userData, avatar: userData.avatar || "🎬" };
    setIsLoggedIn(true);
    setUser(u);
    localStorage.setItem("algaid_user", JSON.stringify(u));
    setShowLoginModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("algaid_user");
  };

  const addFavorite = (movie) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    setFavorites((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      const updated = [...prev, movie];
      localStorage.setItem("algaid_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem("algaid_favorites", JSON.stringify(updated));
      return updated;
    });
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
    setUser((prev) => {
      const updated = { ...prev, avatar };
      localStorage.setItem("algaid_user", JSON.stringify(updated));
      return updated;
    });
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
