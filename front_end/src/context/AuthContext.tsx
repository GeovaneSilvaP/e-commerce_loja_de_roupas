import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: number;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextType);

// Decodifica o payload do JWT sem biblioteca extra
function decodeToken(token: string): User | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, isAdmin: payload.isAdmin ?? false };
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      // Pega o id real do token, não hardcoded
      setUser(decodeToken(storedToken));
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/login", { email, password });
    const receivedToken = res.data.token;

    localStorage.setItem("token", receivedToken);
    localStorage.setItem("role", "user"); // salva role

    setToken(receivedToken);
    setUser(decodeToken(receivedToken)); // id real do token
  }

  async function register(name: string, email: string, password: string) {
    await api.post("/register", { name, email, password });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);