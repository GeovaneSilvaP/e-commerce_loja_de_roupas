import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Voltar para loja
        </button>

        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart />
          Carrinho
        </h1>
      </div>

      {/* CARRINHO VAZIO */}
      {cart.length === 0 ? (
        <div className="text-center mt-20">
          <p className="text-gray-500 text-lg mb-4">
            Seu carrinho está vazio 🛒
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
          >
            Ir às compras
          </button>
        </div>
      ) : (
        <>
          {/* LISTA DE PRODUTOS */}
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-md transition"
              >
                {/* ESQUERDA */}
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3000/uploads/${item.image_url}`}
                    className="w-20 h-20 object-contain bg-gray-100 rounded-lg p-2"
                    alt={item.name}
                  />

                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                </div>

                {/* DIREITA */}
                <div className="flex items-center gap-6">
                  <p className="font-semibold text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL + CHECKOUT */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-2xl font-bold">
              Total: ${total.toFixed(2)}
            </h2>

            <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 active:scale-95 transition-all duration-200">
              Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;