import { useEffect, useState } from "react";
import {
  ShoppingCart,
  LayoutGrid,
  Shirt,
  User,
  Watch,
  ClipboardList,
  ArrowRight,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import toast from "react-hot-toast";

import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Products } from "../types/Products";

import banner from "../assets/roupasHome.jpg";
import OtherOffers from "../components/OtherOffers";
import Footer from "../components/Footer";

// Decodifica o token para checar isAdmin
function decodeToken(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export default function Home() {
  const [products, setProducts] = useState<Products[]>([]);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const decoded = token ? decodeToken(token) : null;
  const isAdmin = decoded?.isAdmin === true;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const handleAddToCart = (product: Products) => {
    addToCart(product);
    toast.success(`${product.name} adicionado 🛒`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-10 py-4 bg-[#0f0f13]/90 backdrop-blur-md border-b border-white/5">
        <h1 className="text-xl font-extrabold tracking-tight text-white">
          My<span className="text-violet-400">Store</span>
        </h1>

        <ul className="flex gap-1 text-sm text-zinc-400">
          {[
            { icon: <LayoutGrid size={15} />, label: "Categorias" },
            { icon: <Shirt size={15} />, label: "Mulheres" },
            { icon: <User size={15} />, label: "Masculinos" },
            { icon: <Watch size={15} />, label: "Acessórios" },
          ].map(({ icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white cursor-pointer transition-all duration-200"
            >
              {icon}
              {label}
            </li>
          ))}

          <li
            onClick={() => navigate("/meus-pedidos")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white cursor-pointer transition-all duration-200"
          >
            <ClipboardList size={15} />
            Meus Pedidos
          </li>
        </ul>

        <div className="flex items-center gap-3">
          {/* Botão Painel Admin — só aparece para admin */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-violet-400 hover:text-white hover:bg-violet-500/20 border border-violet-500/30 transition-all duration-200"
            >
              <LayoutDashboard size={16} />
              Painel Admin
            </button>
          )}

          {/* Login / Sair */}
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <LogOut size={16} />
              Sair
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <User size={16} />
              Login
            </button>
          )}

          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            <ShoppingCart size={18} className="text-zinc-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto mt-10 px-4">
        <div className="relative bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex items-center justify-between p-10 gap-8 min-h-[280px]">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-violet-400 mb-3 font-medium">
              Nova Coleção de Verão
            </p>
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-6 text-white">
              Coleção de
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                Verão 2025
              </span>
            </h2>
            <button className="flex items-center gap-2 bg-white text-black text-sm font-bold px-6 py-3 rounded-xl hover:bg-zinc-100 active:scale-95 transition-all duration-200">
              COMPRE AGORA <ArrowRight size={16} />
            </button>
          </div>

          <div className="relative z-10 w-2/5 shrink-0">
            <img
              src={banner}
              className="w-full h-56 object-cover rounded-xl shadow-2xl"
              alt="banner"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-6xl mx-auto mt-16 px-4 pb-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
              Seleção especial
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Produtos em <span className="text-violet-400">Destaque</span>
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-violet-400 transition-colors duration-200"
          >
            Ver todos <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map((product) => (
            <div
              key={product.id}
              className="group bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3d3d55]"
            >
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative h-44 bg-[#111118] flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={`http://localhost:3000/uploads/${product.image_url}`}
                  alt={product.name}
                  className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-violet-400/0 group-hover:bg-violet-400/5 transition-all duration-300" />
              </div>

              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-[#f0f0f5] font-semibold text-sm leading-snug truncate">
                    {product.name}
                  </h3>
                  <p className="text-violet-400 font-bold text-base mt-1">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                >
                  <ShoppingCart size={13} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <OtherOffers />
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
