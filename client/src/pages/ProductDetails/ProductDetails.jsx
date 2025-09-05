import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import NewBadge from "../../components/NewBadge/NewBadge";
import WishlistIcon from "../../components/WishlistIcon/WishlistIcon";
import useCart from "../../context/useCart";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${slug}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Tyvärr, denna produkt verkar inte finnas.");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        document.title = data.name;

        return fetch(`http://localhost:8000/api/all-products`);
      })
      .then((response) => response.json())
      .then((allProducts) => {
        const filteredProducts = allProducts.filter((p) => p.slug !== slug);
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 6);
        setSimilarProducts(randomProducts);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return <p>Laddar produkt...</p>;
  if (error) return <p>{error}</p>;

  // eslint-disable-next-line react/prop-types
  const NextArrow = ({ onClick }) => (
    <div className="custom-arrow next" onClick={onClick}>
      <FaArrowRight />
    </div>
  );

  // eslint-disable-next-line react/prop-types
  const PrevArrow = ({ onClick }) => (
    <div className="custom-arrow prev" onClick={onClick}>
      <FaArrowLeft />
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      <section className="product-details-page">
        <div className="product-details-image">
          {product.isNew === 1 && <NewBadge />}
          <img src={product.image} alt={product.name} />
          <WishlistIcon productId={product.id} />
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>
          <h2>{product.brand}</h2>
          <p>{product.description}</p>
          <p className="product-details-price">{product.price} SEK</p>
          <div className="quantity-controls">
            <button onClick={handleDecreaseQuantity} disabled={quantity <= 1}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={handleIncreaseQuantity}>+</button>
          </div>

          <button
            className="product-details-add-to-cart"
            onClick={() => addToCart({ ...product, quantity })}
          >
            Lägg till i varukorg
          </button>
        </div>
      </section>

      {/* Slick-karusell med liknande produkter */}
      {similarProducts.length > 0 && (
        <section className="similar-products-carousel">
          <h2>Liknande produkter</h2>
          <Slider {...sliderSettings}>
            {similarProducts.map((product) => (
              <div key={product.id} className="similar-product-card">
                <Link to={`/products/${product.slug}`}>
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <span className="similar-product-title">
                      {product.name}
                    </span>
                    <span className="similar-product-price">
                      {product.price} SEK
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </section>
      )}
    </>
  );
};

export default ProductDetails;
