import Hero from "../../components/Hero/Hero";
import Spots from "../../components/Spots/Spots";
import ProductGrid from "../../components/ProductGrid/ProductGrid";

const Home = () => {
  return (
    <div>
      <Hero
        title="Freaktown Collection"
        description="Upptäck vår senaste kollektion."
      />
      <Spots />
      <ProductGrid />
    </div>
  );
};

export default Home;
