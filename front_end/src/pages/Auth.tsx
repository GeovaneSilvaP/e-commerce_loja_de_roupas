import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogIn, UserPlus, Shield } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post("/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", "user");

        toast.success("Login realizado!");
        navigate("/");
      } else {
        await api.post("/register", {
          name,
          email,
          password,
        });

        toast.success("Conta criada! Faça login");
        setIsLogin(true);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Erro na autenticação";

      toast.error(message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f13] text-white px-4">
      <div className="w-full max-w-sm bg-[#18181f] border border-[#252530] rounded-2xl p-8 shadow-2xl">
        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold">
            My<span className="text-violet-400">Store</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            {isLogin ? "Entrar na sua conta" : "Criar nova conta"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              placeholder="Nome"
              className="w-full p-3 bg-[#111118] border border-[#252530] rounded-xl"
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#111118] border border-[#252530] rounded-xl"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 bg-[#111118] border border-[#252530] rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-violet-500 hover:bg-violet-600 py-3 rounded-xl font-semibold"
          >
            {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        {/* TOGGLE */}
        <p className="text-center text-sm text-zinc-400 mt-5">
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-400 hover:underline"
          >
            {isLogin ? "Cadastrar" : "Entrar"}
          </button>
        </p>

        {/* ADMIN ACCESS */}
        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <button
            onClick={() => navigate("/admin/login")}
            className="flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-white transition"
          >
            <Shield size={14} />
            Acesso administrativo
          </button>
        </div>
      </div>
    </div>
  );
}
