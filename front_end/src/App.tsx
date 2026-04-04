import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Auth from "./pages/Auth";
import AdminLogin from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import EditProducts from "./components/EditProducts";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";
import AllProducts from "./pages/AllProducts";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider> {/* CartProvider dentro do BrowserRouter */}
        <Routes>
          {/* 🌐 PÚBLICO */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/products" element={<AllProducts />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔐 USUÁRIO LOGADO */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />

          <Route
            path="/meus-pedidos"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />

          {/* 🔒 ADMIN */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <AdminRoute>
                <EditProducts />
              </AdminRoute>
            }
          />
        </Routes>

        <Toaster />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;