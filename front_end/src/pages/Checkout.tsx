import { useState, useEffect } from "react";
import { CartItem } from "../types/CartItem";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { CreditCard, QrCode, Barcode, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadCart() {
      try {
        const response = await api.get("/cart");
        setCart(response.data);
      } catch {
        toast.error("Erro ao carregar carrinho");
      }
    }

    loadCart();
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handleCheckout = async () => {
    try {
      setLoading(true);

      await api.post("/orders", {
        payment_method: paymentMethod,
      });

      toast.success("Pedido realizado com sucesso 🎉");
      navigate("/meus-pedidos");
    } catch {
      toast.error("Erro ao finalizar compra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* PRODUTOS */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2 mb-4">
            <ShoppingBag className="text-violet-400" />
            Checkout
          </h1>

          {cart.length === 0 ? (
            <p className="text-zinc-400">Seu carrinho está vazio</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between bg-[#18181f] border border-[#252530] p-4 rounded-xl hover:border-[#3d3d55] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#111118] p-2 rounded-lg">
                    <img
                      src={`http://localhost:3000/uploads/${item.image_url}`}
                      className="w-16 h-16 object-contain"
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="text-violet-400 font-bold text-sm">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* RESUMO */}
        <div className="bg-[#18181f] border border-[#252530] p-6 rounded-2xl h-fit shadow-lg">

          <h2 className="text-lg font-semibold mb-4">
            Resumo do pedido
          </h2>

          <div className="flex justify-between text-zinc-400 mb-2">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div className="flex justify-between text-zinc-400 mb-4">
            <span>Frete</span>
            <span className="text-green-400">Grátis</span>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-violet-400">
              {formatPrice(total)}
            </span>
          </div>

          {/* PAGAMENTO */}
          <div className="mt-6">
            <h3 className="text-sm text-zinc-400 mb-3">
              Forma de pagamento
            </h3>

            <div className="space-y-2">
              {[
                { id: "pix", label: "Pix", icon: <QrCode size={14} /> },
                {
                  id: "credit_card",
                  label: "Cartão",
                  icon: <CreditCard size={14} />,
                },
                {
                  id: "boleto",
                  label: "Boleto",
                  icon: <Barcode size={14} />,
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === method.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-[#252530] hover:border-[#3d3d55]"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    {method.icon}
                    {method.label}
                  </div>

                  <input
                    type="radio"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value)
                    }
                    className="accent-violet-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* BOTÃO */}
          <button
            onClick={handleCheckout}
            disabled={loading || cart.length === 0}
            className="w-full mt-6 bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {loading ? "Processando..." : "Finalizar compra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
