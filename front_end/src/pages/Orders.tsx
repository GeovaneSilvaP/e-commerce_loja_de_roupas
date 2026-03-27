import { JSX, useEffect, useState } from "react";
import { api } from "../services/api";
import { Order } from "../types/OrderItem";
import { Package, ShoppingBag, Hash, CircleCheck, Clock, XCircle } from "lucide-react";

const statusConfig: Record<string, { label: string; classes: string; icon: JSX.Element }> = {
  pending: {
    label: "Pendente",
    classes: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    icon: <Clock size={12} />,
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

  useEffect(() => {
    async function loadOrders() {
      const response = await api.get("/orders");
      setOrders(response.data);
    }
    loadOrders();
  }, []);

  const getStatus = (status: string) =>
    statusConfig[status] ?? {
      label: status,
      classes: "bg-zinc-400/10 text-zinc-400 border-zinc-400/20",
      icon: <Clock size={12} />,
    };

  return (
    <div className="min-h-screen bg-[#0f0f13] px-10 py-12">
      {/* Header */}
      
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-zinc-600 mb-1">
          {orders.length} pedidos encontrados
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
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >
                    {/* Product image */}
                    <div className="w-16 h-16 bg-[#111118] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      <img
                        src={`http://localhost:3000/uploads/${item.image_url}`}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#f0f0f5] font-semibold text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Qtd: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <span className="text-zinc-300 text-sm font-medium shrink-0">
                      R$ {Number(item.price_at_purchase).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 bg-[#111118] border-t border-[#252530] flex items-center gap-2 text-zinc-600 text-xs">
                <Package size={12} />
                {order.items.length}{" "}
                {order.items.length === 1 ? "item" : "itens"} neste pedido
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}