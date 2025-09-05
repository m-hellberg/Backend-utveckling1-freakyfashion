import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewBadge from "../../components/NewBadge/NewBadge";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";
import "./ProductGrid.css";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((response) => response.json())
      .then((data) => {
        const filteredProducts = data
          .filter((product) => {
            const productDate = new Date(product.publicationDate);
            const today = new Date();
            return productDate <= today;
          })
          .slice(0, 8);

        setProducts(filteredProducts);
      });
  }, []);

  return (
    <section className="product-section">
      <h2 className="product-title">Populära produkter</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
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
          ))
        ) : (
          <p className="loading">
            Vänta en stund medan produkterna laddas, eller försök igen lite
            senare.
          </p>
        )}
      </div>

      <div className="button-container">
        <Link to="/allproducts">
          <button className="view-all-button">SE ALLA PRODUKTER</button>
        </Link>
      </div>
    </section>
  );
};

export default ProductGrid;
