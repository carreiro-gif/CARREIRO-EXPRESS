
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { CartItem, Product, OrderType } from '../types';

interface OrderContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, modifiers: any[], observations: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  orderType: OrderType | null;
  setOrderType: (type: OrderType) => void;
  totalAmount: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);

  const addToCart = useCallback((product: Product, quantity: number, modifiers: any[], observations: string) => {
    const modifierTotal = modifiers.reduce((acc, m) => acc + m.price, 0);
    const itemPrice = (product.price + modifierTotal) * quantity;

    const newItem: CartItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      basePrice: product.price,
      quantity,
      totalPrice: itemPrice,
      selectedModifiers: modifiers,
      observations
    };

    setCart(prev => [...prev, newItem]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPriceWithModifiers = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQty,
          totalPrice: unitPriceWithModifiers * newQty
        };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setOrderType(null);
  }, []);

  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.totalPrice, 0), [cart]);

  return (
    <OrderContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      orderType,
      setOrderType,
      totalAmount
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrder must be used within OrderProvider');
  return context;
};
