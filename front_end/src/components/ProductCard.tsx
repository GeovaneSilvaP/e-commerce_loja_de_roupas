import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const [products, setProducst] = useState<Products[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((response) => {
        setProducst(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleEditProdocuts = async (id: number): Promise<void> => {
    navigate(`/edit/${id}`)
  };

  const handleDelete = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
    setProducst((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-8">Produtos</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: Products) => (
          <div
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            key={product.id}
          >
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-600">Preço: {product.price}</p>
            <p className="text-sm text-gray-500">Estoque: {product.stock}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditProdocuts(product.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCard;
