import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Spots.css";

const Spots = () => {
  const [categories, setCategories] = useState([]);

  const spotDescriptions = {
    shoes: "HIGH HEELS, BOOTS & CREEPERS",
    bags: "TRENDIGA & UNIKA VÄSKOR",
    tops: "TOPPAR FÖR ALLA TILLFÄLLEN",
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/categories", {
          credentials: "include",
        });
        const data = await res.json();
        const spotsCategories = data.filter((category) =>
          Object.keys(spotDescriptions).includes(category.slug)
        );
        setCategories(spotsCategories);
      } catch (err) {
        console.error("Fel vid hämtning av kategorier:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleMouseEnter = (e, category) => {
    const hoverImg = e.currentTarget.querySelector(".hover-animation");
    if (hoverImg) {
      hoverImg.src = category.image;
    }
  };

  return (
    <section className="spots">
      {categories.map((category) => (
        <div
          className="spot"
          key={category.id}
          onMouseEnter={(e) => handleMouseEnter(e, category)}
        >
          {/* statisk bild */}
          <img
            src={category.image.replace("video.webp", ".png")}
            alt={category.name}
            className="spot-image static-image"
          />
          {/* animerad WebP */}
          <img
            src={category.image}
            alt={`${category.name} animation`}
            className="spot-image hover-animation"
          />
          <div className="spot-content">
            <h2>{spotDescriptions[category.slug]}</h2>
            <Link to={`/categories/${category.slug}`} className="spot-btn">
              SE MER
            </Link>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Spots;
