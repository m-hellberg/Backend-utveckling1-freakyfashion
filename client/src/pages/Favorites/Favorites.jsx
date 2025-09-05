import { Link } from "react-router-dom";
import NewBadge from "../../components/NewBadge/NewBadge";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";
import useFavorites from "../../context/useFavorites";
import "./Favorites.css";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <section className="product-section">
      <h2 className="product-title">Mina favoriter</h2>

      {favorites.length > 0 ? (
        <div className="product-grid">
          {favorites.map((product) => (
            <div key={product.id} className="product-card">
              {product.isNew === 1 && <NewBadge />}
              <div className="image-container">
                <Link to={`/products/${product.slug}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </Link>
                <WishlistIcon productId={product.id} />
              </div>
              <p className="product-name">{product.name}</p>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">{product.price} SEK</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-favorites">Du har inga sparade favoriter ännu ❤️</p>
      )}
    </section>
  );
};

export default Favorites;
