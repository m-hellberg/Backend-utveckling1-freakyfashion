import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOrderSummary(data);
        }
      } catch (e) {
        console.error("Kunde inte hämta order:", e);
      }
    })();
  }, [orderId]);

  return (
    <div className="order-confirmation-container">
      <h1 className="confirmation-title">Orderbekräftelse</h1>
      <h2>Tack för din beställning! 🎉</h2>
      <p className="confirmation-text">
        Din order har tagits emot och behandlas nu.
        <br />
        Du kommer snart att få en bekräftelse via e-post.
      </p>

      {orderId && <p className="order-number">Ordernummer: #{orderId}</p>}

      {orderSummary && (
        <>
          <div className="order-summary">
            <h3>Orderdetaljer</h3>
            <p className="total-amount">
              Summa: {orderSummary.order.totalAmount} SEK
            </p>
            <ul>
              {orderSummary.items.map((it) => (
                <li key={it.id}>
                  {it.quantity} x {it.name} — {it.subtotal} SEK
                </li>
              ))}
            </ul>
          </div>

          <div className="shipping-address">
            <h3>Leveransadress</h3>
            <p>
              {orderSummary.order.firstName} {orderSummary.order.lastName}
              <br />
              {orderSummary.order.street}
              <br />
              {orderSummary.order.postalCode} {orderSummary.order.city}
              <br />
              E-post: {orderSummary.order.email}
              <br />
              {orderSummary.order.newsletter
                ? "Du prenumererar på vårt nyhetsbrev ✅"
                : "Du prenumererar inte på vårt nyhetsbrev ❌"}
            </p>
          </div>
        </>
      )}

      <Link to="/" className="back-to-shop">
        Tillbaka till startsidan
      </Link>
    </div>
  );
};

export default OrderConfirmation;
