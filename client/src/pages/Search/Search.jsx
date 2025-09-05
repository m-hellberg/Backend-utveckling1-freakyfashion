import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./Search.css";
import NewBadge from "../../components/NewBadge/NewBadge";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";

const Search = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) return;

    fetch(`http://localhost:8000/api/search?q=${query}`)
      .then((response) => {
        if (!response.ok) return [];
        return response.json();
      })
      .then((data) => {
        setResults(data);
      });
  }, [query]);

  return (
    <section className="search-results-page">
      <h1>
        Hittade {results.length}{" "}
        {results.length === 1 ? "produkt" : "produkter"}
      </h1>
      <div className="search-results-container">
        {results.map((product) => (
          <div key={product.id} className="search-product-card">
            <Link to={`/products/${product.slug}`}>
              {product.isNew === 1 && <NewBadge />}
              <div className="image-container">
                <img src={product.image} alt={product.name} />
                <WishlistIcon />
              </div>
              <h2>{product.name}</h2>
              <p className="product-brand">{product.brand}</p>
              <p className="product-price">{product.price} SEK</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Search;
