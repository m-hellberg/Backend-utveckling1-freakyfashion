import { useContext } from "react";
import FavoritesContext from "./FavoritesContext";

const useFavorites = () => {
  return useContext(FavoritesContext);
};

export default useFavorites;