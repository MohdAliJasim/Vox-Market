"use client";

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartitems, setcartitems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem("Cart");
    if (storedItems) {
      try {
        setcartitems(JSON.parse(storedItems));
      } catch (e) {
        console.error("Failed to parse cart items", e);
        localStorage.removeItem("Cart");
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever cartitems change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("Cart", JSON.stringify(cartitems));
    }
  }, [cartitems, isInitialized]);

  // Add items to cart
  const addToCart = (product) => {
    setcartitems((previtems) => {
      const exist = previtems.find(
        (item) => item.productid === product.productid
      );
      if (exist) {
        return previtems.map((item) =>
          item.productid === product.productid
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...previtems, { ...product }];
      }
    });
  };

  // Remove cart items
  const removeFromCart = (productId) => {
    setcartitems((previtems) => 
      previtems.filter((item) => item.productid !== productId)
    );
  };

  // Clear cart
  const clearCart = () => {
    setcartitems([]);
  };

  // Update quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setcartitems((previtems) =>
        previtems.map((item) =>
          item.productid === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartitems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};