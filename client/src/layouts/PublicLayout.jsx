import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import InfoBanner from "../components/InfoBanner/InfoBanner";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <InfoBanner />
      <Footer />
    </>
  );
};

export default PublicLayout;
