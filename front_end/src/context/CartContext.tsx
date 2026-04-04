import {
  useState,
  useContext,
  createContext,
  useEffect,
  ReactNode,
} from "react";
import { Products } from "../types/Products";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

type CartItem = Products & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Products) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
};

type Props = {
  children: ReactNode;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  /* ==============================
     BUSCAR CARRINHO DO BACKEND
  ================================*/
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; // ✅ não busca se não estiver logado

    const fetchCart = async () => {
      try {
        const response = await api.get("/cart");

        const formatted = response.data.map((item: any) => ({
          id: item.product_id,
          name: item.name,
          price: Number(item.price),
          image_url: item.image_url,
          quantity: item.quantity,
          description: "",
          stock: 0,
        }));

        setCart(formatted);
      } catch (error) {
        console.error("Erro ao buscar carrinho", error);
      }
    };

    fetchCart();
  }, []);

  /* ==============================
     ADICIONAR
  ================================*/
  const addToCart = async (product: Products) => {
    const token = localStorage.getItem("token");

    // ✅ Redireciona para login se não estiver autenticado
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/cart", {
        product_id: product.id,
        quantity: 1,
      });

      setCart((prev) => {
        const itemExists = prev.find((item) => item.id === product.id);

        if (itemExists) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });
    } catch (error) {
      console.error("Erro ao adicionar no carrinho", error);
    }
  };

  /* ==============================
     AUMENTAR
  ================================*/
  const increaseQuantity = async (id: number) => {
    try {
      await api.put(`/cart/increase/${id}`);

      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==============================
     DIMINUIR
  ================================*/
  const decreaseQuantity = async (id: number) => {
    try {
      await api.put(`/cart/decrease/${id}`);

      setCart((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ==============================
     REMOVER
  ================================*/
  const removeFromCart = async (id: number) => {
    try {
      await api.delete(`/cart/${id}`);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);