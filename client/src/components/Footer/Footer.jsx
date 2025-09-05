import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const sections = [
    {
      title: "Kundservice",
      links: [
        { name: "FAQ", path: "#" },
        { name: "Kontakta oss", path: "#" },
        { name: "Returnpolicy", path: "#" },
        { name: "Leverans", path: "#" },
        { name: "Betalning", path: "#" },
      ],
    },
    {
      title: "Mitt konto",
      links: [
        { name: "Logga in", path: "#" },
        { name: "Mina ordrar", path: "#" },
        { name: "Sparade produkter", path: "#" },
        { name: "Inställningar", path: "#" },
        { name: "Adressuppgifter", path: "#" },
      ],
    },
    {
      title: "Om oss",
      links: [
        { name: "Om Freakyfashion", path: "/aboutus" },
        { name: "Vårt team", path: "#" },
        { name: "Hållbarhet", path: "#" },
        { name: "Karriär", path: "#" },
        { name: "Press", path: "#" },
      ],
    },
  ];

  // Dropdown-menyn för mobil
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-mobile">
          {sections.map((section, index) => (
            <div key={index} className="footer-section">
              <button
                className="footer-title"
                onClick={() => toggleSection(index)}
              >
                {section.title} <span>{openSection === index ? "▲" : "▼"}</span>
              </button>
              <ul
                className={`footer-links ${
                  openSection === index ? "show" : ""
                }`}
              >
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.path ? (
                      <Link to={link.path}>{link.name}</Link>
                    ) : (
                      <a href="#">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Horisontell meny för desktop */}
        <div className="footer-desktop">
          {sections.map((section, index) => (
            <div key={index} className="footer-column">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, i) => (
                  <li key={i}>
                    {link.path ? (
                      <Link to={link.path}>{link.name}</Link>
                    ) : (
                      <a href="#">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-copyright">
        <p>© 2025 Freakyfashion</p>
      </div>
    </footer>
  );
};

export default Footer;
