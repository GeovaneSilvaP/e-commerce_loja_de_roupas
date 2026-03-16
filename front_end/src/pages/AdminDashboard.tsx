import CreateProducts from "../components/CreateProducts";
import ProductsCard from "../components/ProductCard";

const AdminDashboard = () => {
  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold">Painel do Administrador</h1>

      <CreateProducts />

      <ProductsCard />
    </div>
  );
};

export default AdminDashboard;
