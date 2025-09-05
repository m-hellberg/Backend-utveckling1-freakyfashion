import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Products from "../pages/Admin/Products";
import NewProduct from "../pages/Admin/NewProduct";
import Categories from "../pages/Admin/Categories";
import NewCategory from "../pages/Admin/NewCategory";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<NewProduct />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products/newcategory" element={<NewCategory />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
