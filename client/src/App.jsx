import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicRoutes from "./routes/PublicRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import RequireAdmin from "./components/RequireAdmin/RequireAdmin";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<PublicRoutes />} />
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminRoutes />
              </RequireAdmin>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
