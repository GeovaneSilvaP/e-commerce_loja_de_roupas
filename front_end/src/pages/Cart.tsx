import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Trash2, LogIn } from "lucide-react";
import { getImageUrl } from "../services/api"; 

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (!token) {
    return (
      <div className="bg-[#0f0f13] min-h-screen text-white flex flex-col items-center justify-center gap-4">
        <ShoppingCart size={48} className="text-zinc-600" />
        <p className="text-zinc-400 text-lg">Faça login para ver seu carrinho</p>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 bg-violet-500 hover:bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold transition active:scale-95"
        >
          <LogIn size={16} />
          Entrar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            <ShoppingCart className="text-violet-400" />
            Carrinho
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center mt-24">
            <p className="text-zinc-500 text-lg mb-6">Seu carrinho está vazio 🛒</p>
            <button
              onClick={() => navigate("/")}
              className="bg-white text-black px-8 py-3 rounded-xl hover:bg-zinc-200 active:scale-95 transition"
            >
              Ir às compras
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#18181f] border border-[#252530] p-5 rounded-2xl hover:border-[#3d3d55] hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-[#111118] p-3 rounded-xl">
                      <img
                        src={getImageUrl(item.image_url!)} 
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-[#f0f0f5]">{item.name}</h3>
                      <p className="text-sm text-zinc-400">{formatPrice(item.price)} cada</p>
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => decreaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition active:scale-90">-</button>
                        <span className="w-6 text-center font-medium text-white">{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item.id)} className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition active:scale-90">+</button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                    <p className="font-bold text-lg text-violet-400">{formatPrice(item.price * item.quantity)}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-zinc-500 hover:text-red-500 transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#18181f] border border-[#252530] p-6 rounded-2xl h-fit shadow-lg">
              <h2 className="text-xl font-semibold mb-4 text-white">Resumo do pedido</h2>
              <div className="flex justify-between text-zinc-400 mb-2"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-zinc-400 mb-4"><span>Frete</span><span className="text-green-500">Grátis</span></div>
              <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-violet-400">{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20"
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;