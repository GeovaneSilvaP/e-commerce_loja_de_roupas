import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Package, Tag, Layers } from "lucide-react";
import toast from "react-hot-toast";

const ProductCard = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((response) => setProducts(response.data))
      .catch(() => toast.error("Erro ao carregar produtos"))
      .finally(() => setLoading(false));
  }, []);

  const handleEditProducts = (id: number) => navigate(`/edit/${id}`);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Produto removido 🗑️");
    } catch {
      toast.error("Erro ao deletar produto");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full">
      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs text-zinc-500 tracking-widest uppercase">
          {products.length} produtos cadastrados
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 bg-[#18181f] border border-[#252530] rounded-2xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-24 gap-3 text-zinc-700">
              <Package size={44} />
              <p className="text-sm">Nenhum produto cadastrado ainda.</p>
            </div>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden flex flex-col min-h-[340px] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#3d3d55]"
            >
              {/* IMAGE */}
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="h-44 bg-[#111118] flex items-center justify-center cursor-pointer group"
              >
                <img
                  src={`http://localhost:3000/uploads/${product.image_url}`}
                  alt={product.name}
                  className="h-36 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* BODY */}
              <div className="flex flex-col justify-between flex-1 p-5 gap-4">
                {/* INFO */}
                <div className="space-y-3">
                  <p className="text-[#f0f0f5] font-bold text-sm">
                    {product.name}
                  </p>

                  <div className="flex flex-col gap-2">
                    <span className="flex items-center gap-2 text-sm text-zinc-400">
                      <Tag size={13} />
                      <strong className="text-violet-400">
                        R$ {Number(product.price).toFixed(2)}
                      </strong>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full w-fit border ${
                        product.stock > 5
                          ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20"
                          : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                      }`}
                    >
                      <Layers size={11} />
                      {product.stock > 5
                        ? `${product.stock} em estoque`
                        : `Apenas ${product.stock}`}
                    </span>
                  </div>
                </div>

                {/* ACTIONS (CORRIGIDO) */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEditProducts(product.id)}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2.5 rounded-xl
                    bg-indigo-500/10 text-indigo-300 border border-indigo-500/25
                    hover:bg-indigo-500/20 active:scale-95 transition"
                  >
                    <Pencil size={12} />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="flex-1 flex items-center justify-center gap-1 text-xs font-semibold py-2.5 rounded-xl
                    bg-red-500/10 text-red-300 border border-red-500/20
                    hover:bg-red-500/20 active:scale-95 transition disabled:opacity-40"
                  >
                    <Trash2 size={12} />
                    {deletingId === product.id
                      ? "Removendo..."
                      : "Excluir"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;