import { JSX, useEffect, useState } from "react";
import { api, getImageUrl } from "../services/api";
import { Order } from "../types/OrderItem";
import {
  Package,
  ShoppingBag,
  Hash,
  CircleCheck,
  Clock,
  XCircle,
  Ban,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const statusConfig: Record<
  string,
  { label: string; classes: string; icon: JSX.Element }
> = {
  pending: {
    label: "Pendente",
    classes: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    icon: <Clock size={12} />,
  },
  // adicionado status paid
  paid: {
    label: "Pago",
    classes: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    icon: <CircleCheck size={12} />,
  },
  completed: {
    label: "Concluído",
    classes: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    icon: <CircleCheck size={12} />,
  },
  cancelled: {
    label: "Cancelado",
    classes: "bg-red-400/10 text-red-400 border-red-400/20",
    icon: <XCircle size={12} />,
  },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (status: string) =>
    statusConfig[status] ?? {
      label: status,
      classes: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
      icon: <Clock size={12} />,
    };

  // Cancela pedido
  const handleCancel = async (orderId: number) => {
    if (!window.confirm("Tem certeza que deseja cancelar este pedido?")) return;

    try {
      setCancellingId(orderId);
      await api.patch(`/orders/${orderId}/cancel`);

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o)),
      );

      toast.success("Pedido cancelado!");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erro ao cancelar pedido");
    } finally {
      setCancellingId(null);
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f13] px-10 py-12">
        <div className="mb-10">
          <div className="h-3 w-32 bg-[#252530] rounded animate-pulse mb-3" />
          <div className="h-10 w-52 bg-[#252530] rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-6 max-w-3xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-[#18181f] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Tela de erro
  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f13] flex flex-col items-center justify-center gap-3 text-red-400">
        <XCircle size={48} />
        <p className="text-sm">Erro ao carregar pedidos.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-zinc-500 hover:text-white transition mt-1"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f13] px-10 py-12">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition"
      >
        <ArrowLeft size={16} />
        Voltar para a loja
      </button>
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} encontrado
          {orders.length !== 1 ? "s" : ""}
        </p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Meus <span className="text-violet-400">Pedidos</span>
        </h1>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-700">
          <ShoppingBag size={48} />
          <p className="text-sm">Nenhum pedido encontrado.</p>
        </div>
      )}

      {/* Orders list */}
      <div className="flex flex-col gap-6 max-w-3xl">
        {orders.map((order) => {
          const status = getStatus(order.status);
          const canCancel =
            order.status === "pending" || order.status === "paid";

          return (
            <div
              key={order.id}
              className="bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#3d3d55] hover:shadow-2xl"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#252530]">
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Hash size={14} className="text-zinc-600" />
                  <span className="text-white font-bold tracking-tight">
                    Pedido {order.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.classes}`}
                  >
                    {status.icon}
                    {status.label}
                  </span>

                  <span className="text-white font-bold text-sm">
                    R$ {Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-6 py-4 flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#111118] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={getImageUrl(item.image_url)}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f0f0f5] font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <span className="text-zinc-300 text-sm font-medium shrink-0">
                      R$ {Number(item.price_at_purchase).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-[#111118] border-t border-[#252530] flex items-center justify-between text-xs text-zinc-600">
                <div className="flex items-center gap-2">
                  <Package size={12} />
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "itens"} neste pedido
                </div>

                {/* Botão cancelar — só aparece se puder cancelar */}
                {canCancel && (
                  <button
                    onClick={() => handleCancel(order.id)}
                    disabled={cancellingId === order.id}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 bg-red-400/5 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                  >
                    <Ban size={11} />
                    {cancellingId === order.id
                      ? "Cancelando..."
                      : "Cancelar pedido"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
