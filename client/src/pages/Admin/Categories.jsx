import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "./Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/admin/categories", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Är du säker på att du vill ta bort kategorin?"))
      return;
    await fetch(`http://localhost:8000/api/admin/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="admin-categories">
        <div className="categories-header">
          <h2>Kategorier</h2>
          <Link to="/admin/products/newcategory">
            <button className="new-category-button">Ny kategori</button>
          </Link>
        </div>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Namn</th>
              <th>Bild</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <img src={c.image} alt={c.name} width="50" />
                </td>
                <td>
                  <button onClick={() => handleDelete(c.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
