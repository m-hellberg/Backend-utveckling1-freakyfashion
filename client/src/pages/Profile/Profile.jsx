import { useEffect, useState } from "react";
import useFavorites from "../../context/useFavorites";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { favorites } = useFavorites();
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    postalCode: "",
    city: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data.user);
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            street: "",
            postalCode: "",
            city: "",
          });
        }
      } catch (e) {
        console.error("Kunde inte hämta användarinformation:", e);
      }
    })();

    (async () => {
      try {
        const res = await fetch("http://localhost:8000/api/my-orders", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.slice(0, 5));
        }
      } catch (e) {
        console.error("Kunde inte hämta beställningar:", e);
      }
    })();
  }, []);

  if (!userInfo) return <p className="loading">Laddar profil...</p>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUserInfo({
      ...userInfo,
      name: formData.name,
      email: formData.email,
      street: formData.street,
      postalCode: formData.postalCode,
      city: formData.city,
    });
    setEditing(false);
    alert("Profil uppdaterad!");
  };

  return (
    <div className="profile-page">
      <h1 className="checkout-title">Mina sidor</h1>
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar">{userInfo.name[0]}</div>
          <div className="user-info">
            <h2>{userInfo.name}</h2>
            <p className="welcome-text">Välkommen tillbaka!</p>
            <p>{userInfo.email}</p>
          </div>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Avbryt" : "Redigera profil"}
        </button>

        {editing && (
          <form className="edit-profile-form" onSubmit={handleSave}>
            <div className="input-field">
              <label>Förnamn och efternamn</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>E-post</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>Gata</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <label>Postnummer</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </div>
            <div className="input-field">
              <label>Stad</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="save-btn">
              Spara ändringar
            </button>
          </form>
        )}

        <section className="profile-section">
          <h3>Profilstatistik</h3>
          <p>Favoriter: {favorites.length}</p>
          <p>Totalt antal beställningar: {orders.length}</p>
        </section>

        <section className="profile-section">
          <h3>Adress</h3>
          {formData.street || formData.postalCode || formData.city ? (
            <div className="address-list">
              {formData.street && <p>{formData.street}</p>}
              {formData.postalCode && <p>{formData.postalCode}</p>}
              {formData.city && <p>{formData.city}</p>}
            </div>
          ) : (
            <p>Ingen adress sparad</p>
          )}
        </section>

        <section className="profile-section">
          <h3>Favoriter</h3>
          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((item) => (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="favorite-card"
                >
                  <img src={item.image} alt={item.name} />
                  <p>{item.name}</p>
                </Link>
              ))}
            </div>
          ) : (
            <p>Du har inga favoriter ännu ❤️</p>
          )}
        </section>

        <section className="profile-section">
          <h3>Senaste beställningar</h3>
          {orders.length > 0 ? (
            <ul className="orders-list">
              {orders.map((order) => (
                <li key={order.id}>
                  <strong>Ordernummer #{order.id}</strong> | {order.totalAmount}{" "}
                  SEK | {new Date(order.createdAt).toLocaleDateString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>Du har inga beställningar ännu.</p>
          )}
        </section>

        <section className="profile-section">
          <h3>Inställningar</h3>
          <Link to="#" className="settings-link">
            Ändra lösenord
          </Link>
          <Link to="#" className="settings-link">
            Nyhetsbrev
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Profile;
