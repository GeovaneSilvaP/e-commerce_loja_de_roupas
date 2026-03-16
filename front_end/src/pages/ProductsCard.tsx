import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate } from "react-router-dom";

const ProductsCard = () => {
  const [products, setProducts] = useState<Products[]>([]);
  const navigate = useNavigate();

  const getProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  const deleteProduct = async (id: number) => {
    const confirmDelete = confirm("Deseja deletar este produto?");

    if (!confirmDelete) return;

    await api.delete(`/products/${id}`);
    getProducts();
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

      {products.map((product) => (

        <div
          key={product.id}
          className="bg-white p-4 rounded-xl shadow"
        >

          <img
            src={`http://localhost:3000/uploads/${product.image_url}`}
            className="h-40 w-full object-cover rounded"
          />

          <h3 className="mt-3 font-semibold">
            {product.name}
          </h3>

          <p className="text-gray-500">
            R$ {product.price}
          </p>

          <p className="text-sm text-gray-400">
            Estoque: {product.stock}
          </p>

          <div className="flex gap-2 mt-3">

            <button
              onClick={() => navigate(`/edit/${product.id}`)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Editar
            </button>

            <button
              onClick={() => deleteProduct(product.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Deletar
            </button>

          </div>

        </div>

      ))}

    </div>
  );
};

export default ProductsCard;