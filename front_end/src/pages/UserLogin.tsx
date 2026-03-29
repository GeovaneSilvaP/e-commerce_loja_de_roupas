import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      toast.success("Login realizado!");

      navigate("/");
    } catch {
      toast.error("Email ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f13] text-white px-4">
      <div className="w-full max-w-sm bg-[#18181f] p-8 rounded-2xl">
        <h1 className="text-xl mb-4">Entrar</h1>

        <input
          placeholder="Email"
          className="w-full mb-3 p-2 bg-[#111]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-3 p-2 bg-[#111]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-violet-500 py-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}