import { useState, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import useFavorites from "../../context/useFavorites";
import "./WishlistIcon.css";

const WishlistIcon = ({ productId }) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [isFilled, setIsFilled] = useState(false);

  // uppdaterar lokalt isFilled när context ändras
  useEffect(() => {
    setIsFilled(favorites.some((p) => p.id === productId));
  }, [favorites, productId]);

  const handleClick = () => {
    toggleFavorite(productId); // uppdaterar backend OCH context
  };

  return (
    <div
      className={`wishlist-icon ${isFilled ? "filled" : ""}`}
      onClick={handleClick}
    >
      {isFilled ? <FaHeart /> : <FaRegHeart />}
    </div>
  );
};

export default WishlistIcon;
