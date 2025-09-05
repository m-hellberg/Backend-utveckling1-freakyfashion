import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/products", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Är du säker på att du vill radera denna produkt?"))
      return;

    const response = await fetch(`http://localhost:8000/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Misslyckades att radera produkten");
    }

    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <h2>Produkter</h2>
        <Link to="/admin/products/new">
          <button className="new-product-button">Ny produkt</button>
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Namn</th>
            <th>SKU</th>
            <th>Pris</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.price} SEK</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
