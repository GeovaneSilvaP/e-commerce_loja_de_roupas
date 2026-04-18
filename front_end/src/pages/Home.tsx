import { useEffect, useState } from "react";
import {
  ShoppingCart,
  LayoutGrid,
  Shirt,
  User,
  Watch,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { api, getImageUrl } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Products } from "../types/Products";

import banner from "../assets/roupasHome.jpg";
import OtherOffers from "../components/OtherOffers";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";

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

  const categories = [
    { icon: <LayoutGrid size={15} />, label: "Todos", value: "" },
    { icon: <Shirt size={15} />, label: "Mulheres", value: "feminino" },
    { icon: <User size={15} />, label: "Masculinos", value: "masculino" },
    { icon: <Watch size={15} />, label: "Acessórios", value: "acessorios" },
  ];

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white">
      <Navbar
        categories={categories}
        navigate={navigate}
        isAdmin={isAdmin}
        token={token}
        handleLogout={handleLogout}
        totalItems={totalItems}
      />

      <section className="max-w-6xl mx-auto mt-6 md:mt-10 px-4">
        <div className="relative bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-6 md:gap-8">
          {/* EFEITOS */}
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-pink-600/10 rounded-full blur-3xl" />

          {/* TEXTO */}
          <div className="relative z-10 text-center md:text-left">
            <p className="text-[10px] md:text-xs uppercase tracking-widest text-violet-400 mb-2 md:mb-3">
              Nova Coleção de Verão
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight mb-4 md:mb-6">
              Coleção de <br />
              <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                Verão 2025
              </span>
            </h2>

            <button className="flex items-center justify-center md:justify-start gap-2 bg-white text-black text-xs md:text-sm font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-zinc-100 transition">
              COMPRE AGORA <ArrowRight size={16} />
            </button>
          </div>

          {/* IMAGEM */}
          <div className="relative z-10 w-full md:w-2/5">
            <img
              src={banner}
              alt="banner"
              className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

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
                  src={getImageUrl(product.image_url!)} 
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
                  onClick={() =>
                    product.stock > 0 ? handleAddToCart(product) : null
                  }
                  disabled={product.stock === 0}
                  className={`mt-auto w-full flex items-center justify-center gap-2 border text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                    product.stock === 0
                      ? "bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed"
                      : "bg-white/5 hover:bg-violet-500/20 border-white/10 hover:border-violet-500/40 text-white"
                  }`}
                >
                  <ShoppingCart size={13} />
                  {product.stock === 0
                    ? "Fora de estoque"
                    : "Adicionar ao Carrinho"}
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
