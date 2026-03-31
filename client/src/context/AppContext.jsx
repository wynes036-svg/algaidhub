import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Local progress helpers (still used as cache)
const getLocalProgress = () => JSON.parse(localStorage.getItem("watchProgress") || "{}");
const saveLocalProgress = (movieId, data) => {
  const all = getLocalProgress();
  all[movieId] = { ...all[movieId], ...data, updatedAt: Date.now() };
  localStorage.setItem("watchProgress", JSON.stringify(all));
};
const removeLocalProgress = (movieId) => {
  const all = getLocalProgress();
  delete all[movieId];
  localStorage.setItem("watchProgress", JSON.stringify(all));
};

const authHeaders = (token) => ({ "Content-Type": "application/json", Authorization: `Bearer ${token}` });

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("algaid_token"));
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("algaid_token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("algaid_user")); } catch { return null; }
  });
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [continueWatching, setContinueWatching] = useState(() => {
    const p = getLocalProgress();
    return Object.values(p).sort((a, b) => b.updatedAt - a.updatedAt);
  });

  // Load user data from server on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/api/user/favorites`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setFavorites(data); })
      .catch(() => {});
    fetch(`${API}/api/user/progress`, { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") {
          const sorted = Object.values(data).sort((a, b) => b.updatedAt - a.updatedAt);
          setContinueWatching(sorted);
          localStorage.setItem("watchProgress", JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, [token]);

  const login = async (userData, authToken) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("algaid_token", authToken);
    localStorage.setItem("algaid_user", JSON.stringify(userData));
    setShowLoginModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    setFavorites([]);
    localStorage.removeItem("algaid_token");
    localStorage.removeItem("algaid_user");
  };

  const addFavorite = async (movie) => {
    if (!isLoggedIn) { setShowLoginModal(true); return; }
    if (favorites.find((m) => m.id === movie.id)) return;
    const updated = [...favorites, movie];
    setFavorites(updated);
    if (token) {
      fetch(`${API}/api/user/favorites`, {
        method: "POST", headers: authHeaders(token),
        body: JSON.stringify({ movie }),
      }).catch(() => {});
    }
  };

  const removeFavorite = async (id) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
    if (token) {
      fetch(`${API}/api/user/favorites/${id}`, {
        method: "DELETE", headers: authHeaders(token),
      }).catch(() => {});
    }
  };

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  const updateProgress = (movie, percent) => {
    if (percent >= 95) {
      removeLocalProgress(movie.id);
      setContinueWatching((prev) => prev.filter((m) => m.id !== movie.id));
      if (token) fetch(`${API}/api/user/progress/${movie.id}`, { method: "DELETE", headers: authHeaders(token) }).catch(() => {});
      return;
    }
    const data = { ...movie, percent };
    saveLocalProgress(movie.id, data);
    setContinueWatching(Object.values(getLocalProgress()).sort((a, b) => b.updatedAt - a.updatedAt));
    if (token) {
      fetch(`${API}/api/user/progress`, {
        method: "POST", headers: authHeaders(token),
        body: JSON.stringify({ movieId: movie.id, data }),
      }).catch(() => {});
    }
  };

  const removeFromContinue = (id) => {
    removeLocalProgress(id);
    setContinueWatching((prev) => prev.filter((m) => m.id !== id));
    if (token) fetch(`${API}/api/user/progress/${id}`, { method: "DELETE", headers: authHeaders(token) }).catch(() => {});
  };

  const updateAvatar = async (avatar) => {
    const updated = { ...user, avatar };
    setUser(updated);
    localStorage.setItem("algaid_user", JSON.stringify(updated));
    if (token) {
      fetch(`${API}/api/user/avatar`, {
        method: "PUT", headers: authHeaders(token),
        body: JSON.stringify({ avatar }),
      }).catch(() => {});
    }
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn, user, login, logout, token,
      favorites, addFavorite, removeFavorite, isFavorite,
      showLoginModal, setShowLoginModal,
      continueWatching, updateProgress, removeFromContinue,
      updateAvatar, API,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
