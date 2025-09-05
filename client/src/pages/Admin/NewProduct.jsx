import { useState, useEffect } from "react";
import "./NewProduct.css";

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    sku: "",
    price: "",
    publicationDate: "",
  });
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // 👈 flera kategorier

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:8000/api/admin/categories", {
        credentials: "include",
      });
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCategoryToggle = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    if (image) {
      data.append("image", image);
    }
    // Lägg till kategorier som JSON-sträng
    data.append("categories", JSON.stringify(selectedCategories));

    const response = await fetch("http://localhost:8000/api/products", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Det gick inte att lägga till produkten");
    }

    window.location.href = "/admin/products";
  };

  return (
    <div className="new-product">
      <h2>Ny produkt</h2>
      <form
        onSubmit={handleSubmit}
        className="new-product-form"
        encType="multipart/form-data"
      >
        <div className="form-field">
          <label htmlFor="new-product-name" className="new-product-label">
            Namn
          </label>
          <input
            type="text"
            id="new-product-name"
            name="name"
            className="new-product-input"
            placeholder="Ange namn"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength={25}
          />
        </div>

        <div className="form-field">
          <label
            htmlFor="new-product-description"
            className="new-product-label"
          >
            Beskrivning
          </label>
          <textarea
            id="new-product-description"
            name="description"
            className="new-product-textarea"
            placeholder="Ange beskrivning"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="new-product-image" className="new-product-label">
            Bild
          </label>
          <input
            type="file"
            id="new-product-image"
            name="image"
            className="new-product-input"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="new-product-brand" className="new-product-label">
            Märke
          </label>
          <input
            type="text"
            id="new-product-brand"
            name="brand"
            className="new-product-input"
            placeholder="Ange märke"
            value={formData.brand}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="new-product-sku" className="new-product-label">
            SKU
          </label>
          <input
            type="text"
            id="new-product-sku"
            name="sku"
            className="new-product-input"
            placeholder="Ange SKU"
            value={formData.sku}
            onChange={handleChange}
            required
            pattern="^[A-Z]{3}\d{3}$"
            title="SKU måste följa formatet XXXYYY (t.ex. ABC123)"
          />
        </div>

        <div className="form-field">
          <label htmlFor="new-product-price" className="new-product-label">
            Pris
          </label>
          <input
            type="number"
            id="new-product-price"
            name="price"
            className="new-product-input"
            placeholder="Ange pris"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label
            htmlFor="new-product-publicationDate"
            className="new-product-label"
          >
            Publiceringsdatum
          </label>
          <input
            type="date"
            id="new-product-publicationDate"
            name="publicationDate"
            className="new-product-input"
            value={formData.publicationDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label className="new-product-label">Kategorier</label>
          <div className="category-checkboxes">
            {categories.map((cat) => (
              <label key={cat.id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={cat.id}
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="add-new-button">
          Lägg till
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
