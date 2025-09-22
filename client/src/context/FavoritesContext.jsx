import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/favorites", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } catch (err) {
        console.error("Kunde inte hämta favoriter:", err);
      }
    };
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (productId) => {
    try {
      let res;
      if (favorites.some((p) => p.id === productId)) {
        res = await fetch(
          `http://localhost:8000/api/favorites/remove/${productId}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
      } else {
        res = await fetch(
          `http://localhost:8000/api/favorites/add/${productId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );
      }
      if (res.ok) {
        const updatedRes = await fetch("http://localhost:8000/api/favorites", {
          credentials: "include",
        });
        const updated = await updatedRes.json();
        setFavorites(updated);
      }
    } catch (err) {
      console.error("Kunde inte uppdatera favoriter:", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
