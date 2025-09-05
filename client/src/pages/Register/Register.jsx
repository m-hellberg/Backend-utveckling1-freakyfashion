import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // viktigt för sessions-cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registrering misslyckades");

      // loggar in anv direkt genom att sätta user i context
      setUser(data.user);
      toast.success("Du är nu registrerad och inloggad!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img
          src="/images/favicon.png"
          alt="Register"
          className="form-illustration"
        />
        <h2>
          Registrera dig <span className="registerspan">På ett kick</span>
        </h2>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Namn"
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Lösenord"
              required
            />
          </div>
          <button type="submit">Registrera</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Register;
