import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user && data.user.admin === 1) {
          setIsAdmin(true);
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Laddar...</p>;
  if (!isAdmin) return <Navigate to="/404" />;

  return children;
};

export default RequireAdmin;
