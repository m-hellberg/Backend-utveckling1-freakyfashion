import CartTable from "../../components/CartTable/CartTable";
import { Link } from "react-router-dom";
import "./Basket.css";
import useCart from "../../context/useCart";

const Basket = () => {
  const { cartItems } = useCart();

  return (
    <div className="basket-container">
      <h1 className="basket-title">Varukorgen</h1>

      {cartItems.length === 0 ? (
        <p className="basket-message empty-basket-message">
          Ojdå, här var det tomt 😢
          <br />
          Upptäck våra produkter och hitta dina favoriter!
        </p>
      ) : (
        <p className="basket-message filled-basket-message">
          ✨ Din varukorg är redo! Kontrollera din beställning innan du går till
          kassan.
        </p>
      )}

      <CartTable editable={true} />

      {cartItems.length > 0 && (
        <div className="to-checkout-button-container">
          <Link to="/checkout">
            <button className="to-checkout-button">TILL KASSAN</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Basket;
