import { useState, useContext, createContext } from "react";
import { Products } from "../types/Products";

type CartItem = Products & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Products) => void;
  removeFromCart: (id: number) => void;
};

const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Products) => {
    const itemExists = cart.find((item) => item.id === product.id);

    if (itemExists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
