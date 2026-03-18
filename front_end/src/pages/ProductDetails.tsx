import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { Products } from "../types/Products";
import { useNavigate, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState<Products | null>(null);
  const [otherProducts, setOtherProducts] = useState<Products[]>([]);

  const getProduct = async (): Promise<void> => {
    const response = await api.get(`/products/${id}`);
    setProduct(response.data[0]);
  };

  const getOtherProducts = async (): Promise<void> => {
    const response = await api.get("/products");
    setOtherProducts(response.data);
  };

  useEffect(() => {
    getProduct();
    getOtherProducts();
  }, [id]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Carregando produto...</p>
      </div>
    );

  //Adicionar ao carrinho alert
  const handleAddToCart = () => {
    addToCart(product);
    toast.success("Produto adicionado ao carrinho 🛒");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* BOTÃO VOLTAR */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-sm text-gray-600 hover:text-black transition"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold mb-8">Informações do produto</h1>

      {/* PRODUTO PRINCIPAL */}
      <div className="grid md:grid-cols-2 gap-10 bg-white p-8 rounded-xl shadow mb-16">
        {/* IMAGEM */}
        <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6">
          <img
            src={`http://localhost:3000/uploads/${product.image_url}`}
            className="max-h-[400px] object-contain"
            alt={product.name}
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-4">{product.name}</h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-black mb-4">${product.price}</p>

          <p className="text-sm text-gray-500 mb-8">
            Estoque disponível: {product.stock}
          </p>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Adicionar ao Carrinho
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* OUTROS PRODUTOS */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Outros produtos</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {otherProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              >
                <img
                  onClick={() => navigate(`/product/${item.id}`)}
                  src={`http://localhost:3000/uploads/${item.image_url}`}
                  className="h-40 mx-auto object-contain"
                />

                <h3 className="mt-4 font-medium">{item.name}</h3>

                <p className="text-gray-500">${item.price}</p>

                <button className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
