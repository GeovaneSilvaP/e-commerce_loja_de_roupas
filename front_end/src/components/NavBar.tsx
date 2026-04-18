import { useState } from "react";
import {
  ShoppingCart,
  User,
  ClipboardList,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

export default function Navbar({
  categories,
  navigate,
  isAdmin,
  token,
  handleLogout,
  totalItems,
}: any) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0f13]/90 backdrop-blur-md border-b border-white/5">
      <div className="flex justify-between items-center px-4 md:px-10 py-4">
        
        {/* LOGO */}
        <h1 className="text-lg md:text-xl font-extrabold text-white">
          My<span className="text-violet-400">Store</span>
        </h1>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-1 text-sm text-zinc-400">
          {categories.map(({ icon, label, value }: any) => (
            <li
              key={label}
              onClick={() =>
                value
                  ? navigate(`/products?category=${value}`)
                  : navigate("/products")
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white cursor-pointer transition-all"
            >
              {icon}
              {label}
            </li>
          ))}

          <li
            onClick={() => navigate("/meus-pedidos")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 hover:text-white cursor-pointer"
          >
            <ClipboardList size={15} />
            Meus Pedidos
          </li>
        </ul>

        {/* AÇÕES */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* ADMIN */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-4 md:py-2 rounded-xl text-violet-400 hover:text-white hover:bg-violet-500/20 border border-violet-500/30 transition-all duration-200"
            >
              <LayoutDashboard size={16} />
              <span className="hidden md:inline ml-2">Painel</span>
            </button>
          )}

          {/* LOGIN / LOGOUT */}
          {token ? (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <LogOut size={16} />
              Sair
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <User size={16} />
              Login
            </button>
          )}

          {/* CARRINHO */}
          <button
            onClick={() => navigate("/cart")}
            className="relative w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10"
          >
            <ShoppingCart size={18} className="text-zinc-300" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>

          {/* MENU MOBILE */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <ul className="flex flex-col gap-2 text-zinc-400">

            {categories.map(({ icon, label, value }: any) => (
              <li
                key={label}
                onClick={() => {
                  setMenuOpen(false);
                  value
                    ? navigate(`/products?category=${value}`)
                    : navigate("/products");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                {icon}
                {label}
              </li>
            ))}

            <li
              onClick={() => {
                setMenuOpen(false);
                navigate("/meus-pedidos");
              }}
              className="flex items-center gap-2 px-3 py-2"
            >
              <ClipboardList size={15} />
              Meus Pedidos
            </li>

            {/* ADMIN MOBILE */}
            {isAdmin && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/admin");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-violet-400 hover:bg-violet-500/10 mt-2"
              >
                <LayoutDashboard size={16} />
                Painel Admin
              </button>
            )}

            {/* LOGIN / LOGOUT MOBILE */}
            {token ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <LogOut size={16} />
                Sair
              </button>
            ) : (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <User size={16} />
                Login
              </button>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}