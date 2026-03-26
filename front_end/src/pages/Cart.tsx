import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Trash2 } from "lucide-react";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingCart className="text-black" />
          Carrinho
        </h1>
      </div>

      {/* CARRINHO VAZIO */}
      {cart.length === 0 ? (
        <div className="text-center mt-24">
          <p className="text-gray-500 text-lg mb-6">
            Seu carrinho está vazio 🛒
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Ir às compras
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LISTA */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition"
              >
                {/* ESQUERDA */}
                <div className="flex items-center gap-4">
                  <img
                    src={`http://localhost:3000/uploads/${item.image_url}`}
                    alt={item.name}
                    className="w-20 h-20 object-contain bg-gray-100 rounded-xl p-2"
                  />

                  <div>
                    <h3 className="font-semibold text-lg">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} cada
                    </p>

                    {/* CONTADOR */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        -
                      </button>

                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* DIREITA */}
                <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                  <p className="font-bold text-lg">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMO */}
          <div className="bg-white p-6 rounded-2xl shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Resumo do pedido
            </h2>

            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex justify-between text-gray-600 mb-4">
              <span>Frete</span>
              <span className="text-green-600">Grátis</span>
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 active:scale-95 transition">
              Finalizar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;