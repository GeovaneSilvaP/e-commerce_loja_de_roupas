import CreateProducts from "../components/CreateProducts";
import ProductsCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, PlusCircle, ShoppingBag } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Painel <span className="text-violet-400">Admin</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Gerencie seus produtos e estoque
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* ✅ Botão para ver pedidos */}
            <button
              onClick={() => navigate("/admin/orders")}
              className="flex items-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95"
            >
              <ShoppingBag size={16} />
              Ver Pedidos
            </button>

            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95"
            >
              <ArrowLeft size={16} />
              Voltar
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* CREATE PRODUCT */}
          <div className="lg:col-span-1">
            <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-6 shadow-lg h-fit">
              <div className="flex items-center gap-2 mb-4">
                <PlusCircle className="text-violet-400" size={18} />
                <h2 className="text-lg font-semibold">Novo Produto</h2>
              </div>
              <CreateProducts />
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="lg:col-span-2">
            <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Package className="text-violet-400" size={18} />
                <h2 className="text-lg font-semibold">Produtos Cadastrados</h2>
              </div>
              <ProductsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
