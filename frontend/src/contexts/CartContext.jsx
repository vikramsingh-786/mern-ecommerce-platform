import React, { createContext, useContext, useState, useEffect } from "react";
import { useGetCartQuery } from "../api/cartApi"; 

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Fetch cart data on app load
  const { data: cartData, refetch } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Ensure this condition is properly handled
  });

  useEffect(() => {
    if (cartData?.items) {
      const totalQuantity = cartData.items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(totalQuantity);
    }
  }, [cartData]);

  const updateCartCount = (count) => {
    setCartCount(count);
  };

  const clearCartState = () => {
    setCartCount(0);
    setCart({ items: [], totalPrice: 0 });
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        cart,
        setCart,
        isAuthenticated,
        clearCartState,
        refetch, 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);