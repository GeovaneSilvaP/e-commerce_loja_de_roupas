import { JSX, useEffect, useState } from "react";
import { api, getImageUrl } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Hash,
  Clock,
  CircleCheck,
  XCircle,
  User,
  Search,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";

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

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "paid", label: "Pago" },
  { value: "completed", label: "Concluído" },
  { value: "cancelled", label: "Cancelado" },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/admin/orders")
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

  const formatPrice = (value: number) =>
    Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Atualiza status do pedido
  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      toast.success("Status atualizado!");
    } catch {
      toast.error("Erro ao atualizar status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtra por status e busca por usuário
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.user_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Pedidos <span className="text-violet-400">dos Usuários</span>
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              {filteredOrders.length} pedido
              {filteredOrders.length !== 1 ? "s" : ""} encontrado
              {filteredOrders.length !== 1 ? "s" : ""}
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

        {/* FILTROS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Busca por usuário */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#18181f] border border-[#252530] focus:border-violet-500/60 outline-none pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-zinc-600 transition"
            />
          </div>

          {/* Filtro por status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#18181f] border border-[#252530] focus:border-violet-500/60 outline-none px-4 pr-9 py-2.5 rounded-xl text-sm text-white transition cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            />
          </div>
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

        {/* ERRO */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-red-400">
            <XCircle size={48} />
            <p className="text-sm">
              Erro ao carregar pedidos. Tente novamente.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-zinc-500 hover:text-white transition"
            >
              Recarregar
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-700">
            <ShoppingBag size={48} />
            <p className="text-sm">Nenhum pedido encontrado.</p>
          </div>
        )}

        {/* ORDERS */}
        <div className="flex flex-col gap-6">
          {filteredOrders.map((order) => {
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
                        {formatPrice(item.price_at_purchase)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOOTER COM SELETOR DE STATUS */}
                <div className="px-6 py-3 bg-[#111118] border-t border-[#252530] flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    {order.items.length}{" "}
                    {order.items.length === 1 ? "item" : "itens"} •{" "}
                    {new Date(order.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Seletor de status */}
                  <div className="relative">
                    <select
                      value={order.status}
                      disabled={updatingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value)
                      }
                      className="appearance-none bg-[#18181f] border border-[#252530] hover:border-violet-500/40 outline-none px-3 pr-7 py-1.5 rounded-lg text-xs text-white transition cursor-pointer disabled:opacity-50"
                    >
                      {statusOptions
                        .filter((o) => o.value !== "all")
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                    <ChevronDown
                      size={11}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
