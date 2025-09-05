import { FaGlobe, FaPlane, FaShieldAlt, FaSmile } from "react-icons/fa";
import "./InfoBanner.css";

const InfoBanner = () => {
  const infoItems = [
    { icon: <FaGlobe />, text: "Gratis frakt och returer" },
    { icon: <FaPlane />, text: "Expressfrakt" },
    { icon: <FaShieldAlt />, text: "Säkra betalningar" },
    { icon: <FaSmile />, text: "Nyheter varje dag" },
  ];

  return (
    <section className="info-banner">
      {infoItems.map((item, index) => (
        <div key={index} className="info-item">
          {item.icon}
          <p>{item.text}</p>
        </div>
      ))}
    </section>
  );
};

export default InfoBanner;
