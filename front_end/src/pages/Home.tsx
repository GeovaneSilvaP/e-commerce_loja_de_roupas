import { useEffect, useState } from "react";
import { ShoppingCart, User } from "lucide-react";
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
          <li>Categories</li>
          <li>Women</li>
          <li>Men</li>
          <li>Accessories</li>
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Admin Login
          </button>

          <User />
          <ShoppingCart />
        </div>
      </nav>

      {/* HERO */}

      <section className="max-w-6xl mx-auto mt-10">
        <div className="bg-gray-200 rounded-xl flex items-center justify-between p-10">
          <div>
            <p className="text-sm text-gray-500 mb-2">NEW SUMMER COLLECTION</p>

            <h2 className="text-4xl font-bold mb-4">Summer Collection</h2>

            <button className="bg-black text-white px-6 py-2 rounded">
              SHOP NOW
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
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:3000/uploads/${product.image_url}`}
                className="h-40 mx-auto object-contain"
              />

              <h3 className="mt-4 font-medium">{product.name}</h3>

              <p className="text-gray-500">${product.price}</p>

              <button className="mt-3 w-full bg-black text-white py-2 rounded">
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
