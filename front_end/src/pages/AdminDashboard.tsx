import CreateProducts from "../components/CreateProducts";
import ProductsCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel do Administrador
        </h1>

        <button
          className="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-900 transition"
          onClick={handleBack}
        >
          Voltar
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Criar Novo Produto
        </h2>

        <CreateProducts />
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Produtos Cadastrados
        </h2>

        <ProductsCard />
      </div>
    </div>
  );
};

export default AdminDashboard;
