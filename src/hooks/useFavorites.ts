import { useEffect, useState } from "react";

const STORAGE_KEY = "boutique_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      let updated;

      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    favorites,
    toggleFavorite,
    clearFavorites,
    isFavorite: (id: string) => favorites.includes(id),
    count: favorites.length,
  };
}
