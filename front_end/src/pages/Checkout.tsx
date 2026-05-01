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
  const [copied, setCopied] = useState(false);
  const [needsCpf, setNeedsCpf] = useState(false);
  const [cpf, setCpf] = useState("");
  const [savingCpf, setSavingCpf] = useState(false);
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
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

      const pixResponse = await api.post("/pix", {
        total: Number(total.toFixed(2)),
      });

      if (!pixResponse.data?.qr_code_base64) {
        throw new Error("Erro ao gerar PIX");
      }

      setPixData(pixResponse.data);

      await api.post("/orders", { payment_method: "pix" });

      setCart([]);
      toast.success("Pedido criado! Faça o pagamento via Pix.");
    } catch (error: any) {
      if (error?.response?.data?.needsCpf) {
        setNeedsCpf(true);
        return;
      }
      const message =
        error?.response?.data?.error || "Erro ao finalizar compra";
      toast.error(
        typeof message === "string" ? message : "Erro ao finalizar compra",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCpf = async () => {
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11) {
      toast.error("CPF inválido");
      return;
    }

    try {
      setSavingCpf(true);
      await api.patch("/users/cpf", { cpf: cleaned });
      toast.success("CPF salvo!");
      setNeedsCpf(false);
      await handleCheckout();
    } catch {
      toast.error("Erro ao salvar CPF");
    } finally {
      setSavingCpf(false);
    }
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  return (
    <div className="bg-[#0f0f13] min-h-screen text-white px-4 py-6 sm:py-10">
      {/* Botão voltar */}
      <div className="max-w-6xl mx-auto mb-5">
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

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Coluna principal: itens ou Pix */}
        <div className="lg:col-span-2 space-y-4">
          <h1 className="text-xl sm:text-2xl font-extrabold flex items-center gap-2 mb-4">
            <ShoppingBag className="text-violet-400" size={22} />
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
            <div className="bg-[#18181f] border border-[#252530] rounded-2xl p-5 sm:p-8 flex flex-col items-center gap-5 sm:gap-6">
              <div className="text-center">
                <QrCode className="text-violet-400 mx-auto mb-2" size={30} />
                <h2 className="text-lg sm:text-xl font-bold">Pague com Pix</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  Escaneie o QR Code ou copie o código abaixo
                </p>
              </div>

              <div className="bg-white p-3 sm:p-4 rounded-2xl">
                <img
                  src={`data:image/png;base64,${pixData.qr_code_base64}`}
                  alt="QR Code Pix"
                  className="w-44 h-44 sm:w-56 sm:h-56"
                />
              </div>

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
                    <span className="hidden xs:inline">
                      {copied ? "Copiado!" : "Copiar"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => navigate("/meus-pedidos")}
                className="w-full bg-violet-500 hover:bg-violet-600 text-white py-3 rounded-xl font-semibold transition text-sm sm:text-base"
              >
                Ver meus pedidos
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center justify-between bg-[#18181f] border border-[#252530] p-3 sm:p-4 rounded-xl hover:border-[#3d3d55] transition gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="bg-[#111118] p-2 rounded-lg shrink-0">
                    <img
                      src={getImageUrl(item.image_url!)}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      Qtd: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-violet-400 font-bold text-sm shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Resumo — no mobile fica embaixo, no lg fica na lateral */}
        {!pixData && (
          <div className="bg-[#18181f] border border-[#252530] p-5 sm:p-6 rounded-2xl h-fit shadow-lg">
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              Resumo do pedido
            </h2>

            <div className="flex justify-between text-zinc-400 mb-2 text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex justify-between text-zinc-400 mb-4 text-sm">
              <span>Frete</span>
              <span className="text-green-400">Grátis</span>
            </div>

            <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-base sm:text-lg">
              <span>Total</span>
              <span className="text-violet-400">{formatPrice(total)}</span>
            </div>

            <div className="mt-5 sm:mt-6">
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

            {/* Campo CPF */}
            {needsCpf && (
              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <p className="text-xs text-yellow-400">
                    Informe seu CPF para continuar com o pagamento via Pix.
                  </p>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatCpf(e.target.value))}
                  maxLength={14}
                  className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 transition"
                />
                <button
                  onClick={handleSaveCpf}
                  disabled={savingCpf || cpf.replace(/\D/g, "").length !== 11}
                  className="w-full bg-violet-500 hover:bg-violet-600 disabled:opacity-50 py-3 rounded-xl text-sm font-semibold transition"
                >
                  {savingCpf ? "Salvando..." : "Salvar CPF e continuar"}
                </button>
              </div>
            )}

            {!needsCpf && (
              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full mt-5 sm:mt-6 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 text-sm sm:text-base"
              >
                {loading ? "Processando..." : "Finalizar compra"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
