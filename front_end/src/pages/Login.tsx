import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/admin/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", "admin"); // ✅ estava faltando isso

      navigate("/admin");
    } catch {
      setError("Email ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f13] text-white px-4">
      <div className="w-full max-w-sm bg-[#18181f] border border-[#252530] rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight">
            My<span className="text-violet-400">Store</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Painel administrativo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="admin@email.com"
              className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#111118] border border-[#252530] focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none p-3 rounded-xl text-sm transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* ✅ Exibe erro sem usar alert() */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-violet-500/20"
          >
            <LogIn size={16} />
            Entrar
          </button>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Acesso restrito para administradores
        </p>
      </div>
    </div>
  );
};

export default Login;