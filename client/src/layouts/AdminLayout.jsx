import { Link } from "react-router-dom";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Administration</h1>
      </header>

      <div className="admin-container">
        <nav className="admin-sidebar">
          <ul>
            <li>
              <Link to="#">Dashboard</Link>
            </li>
            <li>
              <Link to="/admin/products">Produkter</Link>
            </li>
            <li>
              <Link to="/admin/categories">Kategorier</Link>
            </li>
            <li>
              <Link to="#">Orderhantering</Link>
            </li>
            <li>
              <Link to="#">Analysdata</Link>
            </li>
            <li>
              <Link to="#">Inställningar</Link>
            </li>
            <li>
              <Link to="#">Support</Link>
            </li>
          </ul>
        </nav>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
