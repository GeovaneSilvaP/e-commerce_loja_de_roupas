import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Products } from "../types/Products";

const ProductCard = () => {
  const [products, setProducst] = useState<Products[]>([]);

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
              <button className="bg-blue-500 text-white px-3 py-1 rounded">
                Editar
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">
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
