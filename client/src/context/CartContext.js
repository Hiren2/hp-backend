import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // 🔥 Added Coupon State

  // Load from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;
    setCart(storedCart);
    setAppliedCoupon(storedCoupon);
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Sync coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem("appliedCoupon");
    }
  }, [appliedCoupon]);

  /* ADD */
  const addToCart = (service) => {
    setCart((prev) => {
      if (prev.find((s) => s._id === service._id)) return prev;

      // 🔥 trigger animation
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);

      return [...prev, service];
    });
  };

  /* REMOVE */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((s) => s._id !== id));
  };

  /* CLEAR */
  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null); // Clear coupon on order complete
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
        appliedCoupon, // 🔥 Exported Coupon State
        setAppliedCoupon // 🔥 Exported Setter
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);