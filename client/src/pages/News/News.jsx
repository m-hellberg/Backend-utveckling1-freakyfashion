import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";

const News = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/new-products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fel vid hämtning av nya produkter:", err));
  }, []);

  return (
    <section className="product-section">
      <h2 className="product-title">Senaste nytt</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
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
          ))
        ) : (
          <p className="loading">Det finns inga nya produkter just nu..</p>
        )}
      </div>
    </section>
  );
};

export default News;
