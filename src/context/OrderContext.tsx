// src/context/OrderContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  observations?: string;
}

export type OrderType = 'dine-in' | 'takeout';

interface OrderContextType {
  // Carrinho
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Totais
  cartTotal: number;
  cartCount: number;
  
  // Tipo do pedido
  orderType: OrderType | null;
  setOrderType: (type: OrderType) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType | null>(null);

  // Adicionar item ao carrinho
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = prev.findIndex((i) => i.id === item.id);

      if (existingItemIndex > -1) {
        // Se existe, aumenta a quantidade
        const updated = [...prev];
        updated[existingItemIndex].quantity += 1;
        return updated;
      } else {
        // Se não existe, adiciona novo item com quantidade 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Remover item do carrinho
  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Atualizar quantidade
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCart([]);
    setOrderType(null);
  };

  // Calcular total do carrinho
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Contar itens no carrinho
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <OrderContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        orderType,
        setOrderType,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};
