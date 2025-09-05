import { createContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // hämtar varukorg från backend när user ändras
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/cart", {
          credentials: "include",
        });
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (e) {
        console.error("Kunde inte hämta varukorg:", e);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]); // körs varje gång användaren ändras (login/logout)

  const addToCart = async (product) => {
    try {
      const res = await fetch("http://localhost:8000/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product.id,
          quantity: product.quantity || 1,
        }),
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Fel vid addToCart:", e);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Fel vid updateQuantity:", e);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      setCartItems(data.items || []);
    } catch (e) {
      console.error("Fel vid removeFromCart:", e);
    }
  };

  const clearCart = async () => {
    try {
      await fetch("http://localhost:8000/api/cart", {
        method: "DELETE",
        credentials: "include",
      });
      setCartItems([]);
    } catch (e) {
      console.error("Fel vid clearCart:", e);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
