import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
  id: number;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      setUser({ id: 1 }); 
    }
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post("/login", { email, password });

    localStorage.setItem("token", res.data.token);

    setToken(res.data.token);
    setUser({ id: 1 });
  }

  async function register(name: string, email: string, password: string) {
    await api.post("/register", { name, email, password });
  }

  function logout() {
    localStorage.removeItem("token");
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