import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white flex flex-col items-center justify-center px-4">
      {/* GLOW */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center">
        {/* NÚMERO */}
        <h1 className="text-[10rem] font-extrabold leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-violet-400 to-violet-900 select-none">
          404
        </h1>

        <p className="text-2xl font-bold text-white mb-2">
          Página não encontrada
        </p>

        <p className="text-zinc-500 text-sm mb-10 max-w-sm mx-auto">
          A página que você tentou acessar não existe ou foi removida.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200"
          >
            <ArrowLeft size={15} />
            Voltar
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-500 hover:bg-violet-600 transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20"
          >
            <Home size={15} />
            Ir para a Home
          </button>
        </div>
      </div>
    </div>
  );
}