import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('coffee_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('coffee_cart', JSON.stringify(cart));
    calculateTotal();
  }, [cart]);

    const calculateTotal = () => {
      const newTotal = cart.reduce((sum, item) => {
        const effectivePrice = (item.price > 0 && item.discount_price > 0 && item.discount_price < item.price) 
                              ? item.discount_price 
                              : item.price;
        return sum + (effectivePrice * item.quantity);
      }, 0);
      setTotal(Math.floor(newTotal * 100) / 100);
    };

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        toast.success(`Added another ${product.name} to cart`);
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        toast.success(`${product.name} added to cart`);
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};