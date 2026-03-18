import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import EditProducts from "./components/EditProducts";
import PrivateRoute from "./routes/PrivateRoute";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal da loja */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Login do administrador */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard protegido */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Editar produto (admin) */}
        <Route
          path="/edit/:id"
          element={
            <PrivateRoute>
              <EditProducts />
            </PrivateRoute>
          }
        />
      </Routes>
      
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
