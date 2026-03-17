import { useEffect, useState } from "react";
import { ShoppingCart, LayoutGrid, Shirt, User, Watch } from "lucide-react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

//imagens
import banner from "../assets/roupasHome.jpg";

type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const navigate = useNavigate();

  const getProducts = async () => {
    const response = await api.get("/products");

    setProducts(response.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* NAVBAR */}

      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow">
        <h1 className="text-xl font-bold">My Store</h1>

        <ul className="flex gap-6 text-gray-600">
          <li className="flex items-center gap-2 hover:text-black cursor-pointer">
            <LayoutGrid size={18} />
            Categorias
          </li>

          <li className="flex items-center gap-2 hover:text-black cursor-pointer">
            <Shirt size={18} />
            Mulheres
          </li>

          <li className="flex items-center gap-2 hover:text-black cursor-pointer">
            <User size={18} />
            Masculinos
          </li>

          <li className="flex items-center gap-2 hover:text-black cursor-pointer">
            <Watch size={18} />
            Acessórios
          </li>
        </ul>

        <div className="flex items-center gap-6">
          {/* USUÁRIO */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User size={20} />
            <span className="text-sm">Login</span>
          </button>

          {/* CARRINHO */}
          <div className="relative cursor-pointer">
            <ShoppingCart size={22} className="hover:text-black transition" />

            {/* BADGE (quantidade) */}
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
              2
            </span>
          </div>
        </div>
      </nav>

      {/* HERO */}

      <section className="max-w-6xl mx-auto mt-10">
        <div className="bg-gray-200 rounded-xl flex items-center justify-between p-10">
          <div>
            <p className="text-sm text-gray-500 mb-2">NOVA COLEÇÃO DE VERÃO</p>

            <h2 className="text-4xl font-bold mb-4">Coleção de Verão</h2>

            <button className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200">
              COMPRE AGORA <ShoppingCart size={18} />
            </button>
          </div>

          <div className="w-1/2 h-full">
            <img
              src={banner}
              className="w-full h-full object-cover rounded-lg"
              alt="banner"
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS */}

      <section className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl font-bold mb-6">Produtos em Destaque</h2>

        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                onClick={() => navigate(`/product/${product.id}`)}
                src={`http://localhost:3000/uploads/${product.image_url}`}
                className="h-40 mx-auto object-contain"
              />

              <h3 className="mt-4 font-medium">{product.name}</h3>

              <p className="text-gray-500">${product.price}</p>

              <button className="mt-3 w-full bg-black text-white py-2 rounded">
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
