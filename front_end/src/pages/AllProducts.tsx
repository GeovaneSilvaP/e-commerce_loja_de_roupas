import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Erro ao carregar produtos"));
  }, []);

  const handleAddToCart = (product: Products) => {
    addToCart(product);
    toast.success(`${product.name} adicionado 🛒`);
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white px-4 py-10">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10">
        {/* VOLTAR */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition group mb-6"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-violet-500/20 transition">
            <ArrowLeft size={16} />
          </span>
          Voltar
        </button>

        {/* TITULO */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
              Catálogo completo
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Todos os <span className="text-violet-400">Produtos</span>
            </h1>
          </div>

          <span className="text-sm text-zinc-500">{products.length} itens</span>
        </div>
      </div>

      {/* GRID */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col
              transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:border-[#3d3d55]"
            >
              {/* IMAGE */}
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative h-44 bg-[#111118] flex items-center justify-center cursor-pointer overflow-hidden"
              >
                <img
                  src={`http://localhost:3000/uploads/${product.image_url}`}
                  alt={product.name}
                  className="h-36 w-full object-contain transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />

                <div className="absolute inset-0 bg-violet-400/0 group-hover:bg-violet-400/10 transition" />

                {/* Hover label */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-xs font-semibold text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Ver produto
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div>
                  <h3 className="text-[#f0f0f5] font-semibold text-sm truncate">
                    {product.name}
                  </h3>

                  <p className="text-violet-400 font-bold text-base mt-1">
                    R$ {Number(product.price).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-auto w-full flex items-center justify-center gap-2
                  bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40
                  text-white text-xs font-semibold py-2.5 rounded-xl
                  transition-all duration-200 active:scale-95"
                >
                  <ShoppingCart size={13} />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AllProducts;
