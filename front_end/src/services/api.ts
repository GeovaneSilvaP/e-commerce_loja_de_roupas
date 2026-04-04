import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Função para resolver URL da imagem
// Se já for URL completa (Cloudinary), usa direto
// Se for nome de arquivo antigo, usa o uploads local
export const getImageUrl = (image_url: string) => {
  if (!image_url) return "";
  if (image_url.startsWith("http")) return image_url; // Cloudinary
  return `${import.meta.env.VITE_API_URL}/uploads/${image_url}`; // legado local
};

export const uploadsUrl = `${import.meta.env.VITE_API_URL}/uploads`;

// Interceptor fixo aqui, fora de qualquer componente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
