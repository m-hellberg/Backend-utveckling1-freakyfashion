import "./Hero.css";
// eslint-disable-next-line react/prop-types
const Hero = ({ title, description }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{description}</p>
        <a href="#" className="hero-btn">
          SHOPPA NU
        </a>
      </div>
    </section>
  );
};

export default Hero;
