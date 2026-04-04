import { JSX, useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Hash,
  Clock,
  CircleCheck,
  XCircle,
  User,
} from "lucide-react";

type OrderItem = {
  order_id: number;
  name: string;
  quantity: number;
  price_at_purchase: number;
  image_url: string;
};

type AdminOrder = {
  id: number;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
  user_name: string;
  user_email: string;
  items: OrderItem[];
};

const statusConfig: Record<
  string,
  { label: string; classes: string; icon: JSX.Element }
> = {
  pending: {
    label: "Pendente",
    classes: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    icon: <Clock size={12} />,
  },
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatus = (status: string) =>
    statusConfig[status] ?? {
      label: status,
      classes: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
      icon: <Clock size={12} />,
    };

  const formatPrice = (value: number) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Pedidos <span className="text-violet-400">dos Usuários</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {orders.length} pedido{orders.length !== 1 ? "s" : ""} encontrado
              {orders.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95"
          >
            <ArrowLeft size={16} />
            Voltar ao painel
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-[#18181f] animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-700">
            <ShoppingBag size={48} />
            <p className="text-sm">Nenhum pedido encontrado.</p>
          </div>
        )}

        {/* ORDERS */}
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const status = getStatus(order.status);

            return (
              <div
                key={order.id}
                className="bg-[#18181f] border border-[#252530] rounded-2xl overflow-hidden hover:border-[#3d3d55] hover:shadow-2xl transition-all duration-300"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-[#252530]">
                  <div className="flex items-center gap-3">
                    <Hash size={14} className="text-zinc-600" />
                    <span className="text-white font-bold">
                      Pedido {order.id}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.classes}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* USER INFO */}
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <User size={13} className="text-zinc-600" />
                      <span>{order.user_name}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500">{order.user_email}</span>
                    </div>

                    <span className="text-white font-bold text-sm">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="px-6 py-4 flex flex-col gap-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#111118] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={`http://localhost:3000/uploads/${item.image_url}`}
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
                        {formatPrice(item.price_at_purchase)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="px-6 py-3 bg-[#111118] border-t border-[#252530] flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "itens"}
                  </span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
