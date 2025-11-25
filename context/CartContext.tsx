
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { addToast } = useToast();

  const addToCart = (product: Product, quantity: number) => {
    console.log(`[DEBUG] addToCart called for product ID: ${product.id}, quantity: ${quantity}`);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevItems, { product, quantity }];
      }
      console.log('[DEBUG] New cart state after add:', newItems);
      return newItems;
    });
    addToast(`${product.name} added to cart!`, 'success');
  };

  const removeFromCart = (productId: number) => {
    console.log(`[DEBUG] removeFromCart called for product ID: ${productId}`);
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      console.log('[DEBUG] New cart state after remove:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    console.log(`[DEBUG] updateQuantity called for product ID: ${productId}, new quantity: ${quantity}`);
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems => {
        const newItems = prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        console.log('[DEBUG] New cart state after update:', newItems);
        return newItems;
      });
    }
  };

  const clearCart = () => {
    console.log('[DEBUG] clearCart called.');
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
