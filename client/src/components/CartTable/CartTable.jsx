import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import useCart from "../../context/useCart";
import "./CartTable.css";

const CartTable = ({ editable = true }) => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  return (
    <div>
      {/* Mobilversionen */}
      <div className="mobile-cart-table">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-box">
            <div className="cart-box-info">
              <div className="product-name">
                {item.quantity} x {item.name}
              </div>
              <div className="price">{item.quantity * item.price} SEK</div>
            </div>
            <div className="cart-box-info">
              <div className="original-price">{item.price} SEK</div>

              {editable && (
                <div className="cart-quantity">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  {item.quantity}
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktopversionen */}
      {cartItems.length > 0 && (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Produkt</th>
              <th>Antal</th>
              <th>Pris</th>
              <th>Totalt</th>
              {editable && <th></th>}
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price} SEK</td>
                <td>{item.price * item.quantity} SEK</td>
                {editable && (
                  <td>
                    <button
                      className="decrease-button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    {item.quantity}
                    <button
                      className="increase-button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Total summa */}
      <div className="total-sum">
        Totalt:{" "}
        {cartItems.length > 0
          ? cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )
          : 0}{" "}
        SEK
      </div>
    </div>
  );
};

export default CartTable;
