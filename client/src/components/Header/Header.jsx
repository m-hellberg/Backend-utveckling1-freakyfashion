import { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";
import useCart from "../../context/useCart";
import useFavorites from "../../context/useFavorites";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import UserMenu from "./UserMenu";

const Header = () => {
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cartItems
    ? cartItems.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const favoritesCount = favorites ? favorites.length : 0;

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <UserMenu />
          <Link to="/">
            <img src="/images/Logo.png" alt="FreakyFashion Logo" />
          </Link>
        </div>

        <div className="search-icons-wrapper">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Sök efter en produkt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>
          <div className="icons">
            <Link to="/favorites" className="heart-icon-container">
              <FaHeart className="icon" />
              {favoritesCount > 0 && (
                <span className="cart-count">{favoritesCount}</span>
              )}
            </Link>
            <Link to="/basket" className="cart-icon-container">
              <FaShoppingCart className="icon" />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
            <Link
              to={user ? "/profile" : "/login"}
              className="profile-icon-container"
            >
              <FaUser className="icon" />
            </Link>
          </div>
        </div>
      </div>

      <nav className="menu">
        <ul>
          <li>
            <NavLink
              to="/news"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Nyheter
            </NavLink>
          </li>

          <li className="has-submenu">
            <span
              className="submenu-title"
              onClick={() => {
                if (window.innerWidth < 640) {
                  setSubmenuOpen(!submenuOpen);
                }
              }}
            >
              Kategorier
            </span>
            <ul
              className={`submenu ${
                submenuOpen && window.innerWidth < 640 ? "open" : ""
              }`}
            >
              {categories.map((cat) => (
                <li key={cat.id}>
                  <NavLink
                    to={`/categories/${cat.slug}`}
                    className={({ isActive }) =>
                      isActive ? "active-link" : ""
                    }
                    onClick={() => {
                      if (window.innerWidth < 640) setSubmenuOpen(false);
                    }}
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavLink
              to="/allproducts"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Alla produkter
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/aboutus"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Om oss
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
