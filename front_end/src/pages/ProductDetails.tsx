import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Package, Layers } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState<Products | null>(null);
  const [otherProducts, setOtherProducts] = useState<Products[]>([]);

  useEffect(() => {
    // ✅ backend retorna objeto direto (result[0]), não um array
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
    api.get("/products").then((res) => setOtherProducts(res.data));
  }, [id]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen bg-[#0f0f13]">
        <div className="flex flex-col items-center gap-3 text-zinc-600">
          <Package size={40} />
          <p className="text-sm">Carregando produto...</p>
        </div>
      </div>
    );

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Produto adicionado ao carrinho 🛒");
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* BACK + TITLE */}
        <div className="mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-500 hover:text-violet-400 text-sm transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={15} />
            Voltar à loja
          </button>

          <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
            Detalhes do produto
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Informações do <span className="text-violet-400">Produto</span>
          </h1>
        </div>

        {/* MAIN PRODUCT */}
        <div className="grid md:grid-cols-2 gap-8 bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden mb-16">
          {/* IMAGE */}
          <div className="relative flex items-center justify-center bg-[#111118] p-10 min-h-[360px]">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <img
              src={`http://localhost:3000/uploads/${product.image_url}`}
              className="max-h-[340px] w-full object-contain relative z-10 transition-transform duration-300 hover:scale-105"
              alt={product.name}
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col justify-center p-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight mb-3">
              {product.name}
            </h2>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400 mb-2">
              R$ {Number(product.price).toFixed(2)}
            </p>

            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border w-fit mb-8 ${
                product.stock > 5
                  ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                  : "bg-amber-400/10 text-amber-400 border-amber-400/20"
              }`}
            >
              <Layers size={11} />
              {product.stock > 5
                ? `${product.stock} unidades disponíveis`
                : `Apenas ${product.stock} restantes`}
            </span>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-white text-black text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-zinc-100 active:scale-95 transition-all duration-200"
            >
              <ShoppingCart size={16} />
              Adicionar ao Carrinho
            </button>
          </div>
        </div>

        {/* OTHER PRODUCTS */}
        <section>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
              Explore mais
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Outros <span className="text-violet-400">Produtos</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {otherProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item.id}
                  className="group bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3d3d55]"
                >
                  <div
                    onClick={() => navigate(`/product/${item.id}`)}
                    className="relative h-44 bg-[#111118] flex items-center justify-center cursor-pointer overflow-hidden"
                  >
                    <img
                      src={`http://localhost:3000/uploads/${item.image_url}`}
                      alt={item.name}
                      className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-violet-400/0 group-hover:bg-violet-400/5 transition-all duration-300" />
                  </div>

                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div>
                      <h3 className="text-[#f0f0f5] font-semibold text-sm leading-snug truncate">
                        {item.name}
                      </h3>
                      <p className="text-violet-400 font-bold text-base mt-1">
                        R$ {Number(item.price).toFixed(2)}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        addToCart(item);
                        toast.success(`${item.name} adicionado 🛒`);
                      }}
                      className="mt-auto w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/40 text-white text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                    >
                      <ShoppingCart size={13} />
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;