import CartTable from "../../components/CartTable/CartTable";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      firstName: form.get("first-name"),
      lastName: form.get("last-name"),
      email: form.get("email"),
      street: form.get("street"),
      postalCode: form.get("postal-code"),
      city: form.get("city"),
      newsletter: subscribeNewsletter,
    };

    try {
      const res = await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Kunde inte skapa order");
        return;
      }

      navigate(`/order/confirmation?orderId=${data.orderId}`);
    } catch (err) {
      console.error("Fel vid köp:", err);
      alert("Serverfel. Försök igen.");
    }
  }

  return (
    <div>
      <h1 className="checkout-title">Kassan</h1>
      <CartTable editable={false} />
      <div className="edit-cart-link">
        Vill du ändra något? Gå tillbaka till{" "}
        <Link to="/basket">varukorgen</Link>.
      </div>

      <div className="checkout-form">
        <h2>Kunduppgifter</h2>
        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="input-field">
              <label htmlFor="first-name">Förnamn</label>
              <input
                type="text"
                id="first-name"
                name="first-name"
                placeholder="Ange förnamn"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="last-name">Efternamn</label>
              <input
                type="text"
                id="last-name"
                name="last-name"
                placeholder="Ange efternamn"
                required
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="email">E-post</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ange e-post"
              required
            />
          </div>

          <div className="address-section">
            <h3>Adress</h3>
            <div className="input-field">
              <label htmlFor="street">Gata</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder="Ange gata"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="postal-code">Postnummer</label>
              <input
                type="text"
                id="postal-code"
                name="postal-code"
                placeholder="Ange postnummer"
                required
              />
            </div>
            <div className="input-field">
              <label htmlFor="city">Stad</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Ange stad"
                required
              />
            </div>
          </div>

          <div className="newsletter-checkbox">
            <input
              type="checkbox"
              id="newsletter"
              name="newsletter"
              checked={subscribeNewsletter}
              onChange={() => setSubscribeNewsletter(!subscribeNewsletter)}
            />
            <label htmlFor="newsletter">Jag vill ta emot nyhetsbrev</label>
          </div>

          <div className="submit-button">
            <button type="submit">KÖP</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
