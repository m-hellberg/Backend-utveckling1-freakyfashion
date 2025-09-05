import { useState } from "react";
import "./NewCategory.css";

const NewCategory = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imageFile) {
      alert("Både namn och bild måste anges!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:8000/api/admin/categories", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        window.location.href = "/admin/categories";
      } else {
        const data = await res.json();
        alert(data.error || "Kunde inte skapa kategori");
      }
    } catch (err) {
      console.error("Fel vid skapande av kategori:", err);
      alert("Serverfel. Försök igen.");
    }
  };

  return (
    <div className="new-category">
      <h2>Ny kategori</h2>
      <form onSubmit={handleSubmit} className="new-category-form">
        <div className="form-field">
          <label className="new-category-label">Namn</label>
          <input
            type="text"
            name="name"
            className="new-category-input"
            placeholder="Namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label className="new-category-label">Bild</label>
          <input
            type="file"
            name="image"
            className="new-category-input"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
          />
        </div>

        <button type="submit" className="add-new-category-button">
          Skapa
        </button>
      </form>
    </div>
  );
};

export default NewCategory;
