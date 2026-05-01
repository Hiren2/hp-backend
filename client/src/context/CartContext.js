import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); 

  
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;
    setCart(storedCart);
    setAppliedCoupon(storedCoupon);
  }, []);

  
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);

  
  const addToCart = (service) => {
    setCart((prev) => {
      if (prev.find((s) => s._id === service._id)) return prev;

      
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);

      return [...prev, service];
    });
  };

  
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((s) => s._id !== id));
  };

  
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null); 
    localStorage.removeItem("cart");
    localStorage.removeItem("appliedCoupon");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
        animate,
        addToCart,
        removeFromCart,
        clearCart,
        appliedCoupon, 
        setAppliedCoupon 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);