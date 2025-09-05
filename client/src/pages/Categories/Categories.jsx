import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import NewBadge from "../../components/NewBadge/NewBadge";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";

const Categories = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/categories/${slug}/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fel vid hämtning av produkter för kategori:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p className="loading">Laddar produkter...</p>;

  return (
    <section className="product-section">
      <h2 className="product-title">Produkter i kategorin {slug}</h2>
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
          <p>Inga produkter hittades i denna kategori.</p>
        )}
      </div>
    </section>
  );
};

export default Categories;
