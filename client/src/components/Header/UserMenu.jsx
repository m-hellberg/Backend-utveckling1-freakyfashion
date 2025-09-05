import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useCart from "../../context/useCart";
import { toast } from "react-toastify";
import "./UserMenu.css";

const UserMenu = () => {
  const { user, setUser } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Kollar om session finns vid sidladdning
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data.user) setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout misslyckades");

      setUser(null);
      await clearCart();

      toast.success("Du har loggat ut!");
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  return (
    <div className="user-menu">
      {user ? (
        <>
          <span className="user-email">Hej, {user.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logga ut
          </button>
        </>
      ) : (
        <>
          <Link className="login-link" to="/login">
            Logga in
          </Link>
          <Link className="register-link" to="/register">
            Registrera
          </Link>
        </>
      )}
    </div>
  );
};

export default UserMenu;
