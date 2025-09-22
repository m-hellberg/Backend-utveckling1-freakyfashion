import { Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home/Home";
import AboutUs from "../pages/AboutUs/AboutUs";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Search from "../pages/Search/Search";
import Basket from "../pages/Basket/Basket";
import Checkout from "../pages/Checkout/Checkout";
import AllProducts from "../pages/AllProducts/AllProducts";
import Login from "../pages/LogIn/LogIn";
import Register from "../pages/Register/Register";
import Categories from "../pages/Categories/Categories";
import News from "../pages/News/News";
import OrderConfirmation from "../pages/OrderConfirmation/OrderConfirmation";
import Favorites from "../pages/Favorites/Favorites";
import Profile from "../pages/Profile/Profile";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import "../App.css";

const PublicRoutes = () => {
  return (
    <CartProvider>
      <FavoritesProvider>
        <PublicLayout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/products/:slug" element={<ProductDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/allproducts" element={<AllProducts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/categories/:slug" element={<Categories />} />
            <Route path="/news" element={<News />} />
            <Route path="/order/confirmation" element={<OrderConfirmation />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </PublicLayout>
      </FavoritesProvider>
    </CartProvider>
  );
};

export default PublicRoutes;
