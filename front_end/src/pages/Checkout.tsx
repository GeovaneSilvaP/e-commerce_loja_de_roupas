import { useState, useEffect } from "react";
import {
  ShoppingBag,
  ArrowLeft,
  QrCode,
  CreditCard,
  Barcode,
  Copy,
  CheckCheck,
} from "lucide-react";
import { CartItem } from "../types/CartItem";
import { api, getImageUrl } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Checkout = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    id: number;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
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

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handleCopyPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      toast.success("Código Pix copiado!");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Seu carrinho está vazio");
      return;
    }

    try {
      setLoading(true);

      if (paymentMethod === "pix") {
        const pixResponse = await api.post("/pix", {
          total: Number(total.toFixed(2)),
        });

        setPixData(pixResponse.data);

        // Cria o pedido no banco
        await api.post("/orders", {
          payment_method: "pix",
        });
        setCart([]);

        toast.success("Pedido realizado com sucesso!");
        setTimeout(() => navigate("/meus-pedidos"), 1000);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.error || "Erro ao finalizar compra";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white px-4 py-10">
      {/* VOLTAR */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition group"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 group-hover:bg-violet-500/20 transition">
            <ArrowLeft size={16} />
          </span>
          Voltar para loja
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* PRODUTOS */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-2xl font-extrabold flex items-center gap-2 mb-4">
            <ShoppingBag className="text-violet-400" />
            Checkout
          </h1>

          {cart.length === 0 && !pixData ? (
            <div className="text-center text-zinc-400 py-20">
              <p className="mb-3">Seu carrinho está vazio</p>
              <button
                onClick={() => navigate("/")}
                className="bg-violet-500 px-4 py-2 rounded-lg"
              >
                Voltar para loja
              </button>
            </div>
          ) : pixData ? (
            // QR CODE PIX
            <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-8 flex flex-col items-center gap-6">
              <div className="text-center">
                <QrCode className="text-violet-400 mx-auto mb-2" size={32} />
                <h2 className="text-xl font-bold">Pague com Pix</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Escaneie o QR Code ou copie o código abaixo
                </p>
              </div>

              {/* QR CODE IMAGE */}
              <div className="bg-white p-4 rounded-2xl">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-56 h-56"
                />
              </div>

              {/* COPIA E COLA */}
              <div className="w-full">
                <p className="text-xs text-zinc-500 mb-2 text-center">
                  Pix Copia e Cola
                </p>
                <div className="flex items-center gap-2 bg-[#111118] border border-[#252530] rounded-xl p-3">
                  <p className="text-xs text-zinc-400 truncate flex-1">
                    {pixData.qr_code}
                  </p>
                  <button
                    onClick={handleCopyPix}
                    className="shrink-0 flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition"
                  >
                    {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate("/meus-pedidos")}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Ver meus pedidos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between bg-[#18181f] border border-[#252530] p-4 rounded-xl hover:border-[#3d3d55] transition"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-[#111118] p-2 rounded-lg">
                    <img
                      src={getImageUrl(item.image_url!)}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
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
        {!pixData && (
          <div className="bg-[#18181f] border border-[#252530] p-6 rounded-2xl h-fit shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Resumo do pedido</h2>

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
              <span className="text-violet-400">{formatPrice(total)}</span>
            </div>

            {/* PAGAMENTO */}
            <div className="mt-6">
              <h3 className="text-sm text-zinc-400 mb-3">Forma de pagamento</h3>

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
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-violet-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full mt-6 bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {loading ? "Processando..." : "Finalizar compra"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
