// src/context/OrderContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
  observations?: string
}

export type OrderType = 'dine-in' | 'takeout'

export interface CompletedOrder {
  id: string
  items: CartItem[]
  total: number
  paymentMethod: string
  orderType: OrderType
  timestamp: number
  date: string
}

export interface OrderStats {
  pedidosHoje: number
  pedidosSemana: number
  pedidosMes: number
  totalHoje: number
  totalSemana: number
  totalMes: number
  produtoMaisVendido: string
  ticketMedio: number
  historicoCompleto: CompletedOrder[]
}

interface OrderContextType {
  // Carrinho
  cart: CartItem[]
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  
  // Totais
  cartTotal: number
  cartCount: number
  
  // Tipo do pedido
  orderType: OrderType | null
  setOrderType: (type: OrderType) => void
  
  // Finalizar pedido
  completeOrder: (paymentMethod: string) => string
  
  // Estatísticas
  stats: OrderStats
  getStats: () => OrderStats
}

const ORDERS_STORAGE_KEY = 'carreiro-express-orders'

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderType, setOrderType] = useState<OrderType | null>(null)
  const [completedOrders, setCompletedOrders] = useState<CompletedOrder[]>([])

  // Carregar pedidos salvos do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY)
      if (saved) {
        setCompletedOrders(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error)
    }
  }, [])

  // Salvar pedidos no localStorage
  const saveOrders = (orders: CompletedOrder[]) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (error) {
      console.error('Erro ao salvar histórico:', error)
    }
  }

  // Adicionar item ao carrinho
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existingItemIndex = prev.findIndex((i) => i.id === item.id)

      if (existingItemIndex > -1) {
        const updated = [...prev]
        updated[existingItemIndex].quantity += 1
        return updated
      } else {
        return [...prev, { ...item, quantity: 1 }]
      }
    })
  }

  // Remover item do carrinho
  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Atualizar quantidade
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  // Limpar carrinho
  const clearCart = () => {
    setCart([])
    setOrderType(null)
  }

  // Calcular total do carrinho
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  // Contar itens no carrinho
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Finalizar pedido e salvar no histórico
  const completeOrder = (paymentMethod: string): string => {
    const orderId = `ORD-${Date.now()}`
    const now = new Date()
    
    const newOrder: CompletedOrder = {
      id: orderId,
      items: [...cart],
      total: cartTotal,
      paymentMethod,
      orderType: orderType || 'dine-in',
      timestamp: now.getTime(),
      date: now.toISOString(),
    }

    const updated = [...completedOrders, newOrder]
    setCompletedOrders(updated)
    saveOrders(updated)
    
    clearCart()
    
    return orderId
  }

  // Calcular estatísticas
  const getStats = (): OrderStats => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Filtrar pedidos
    const pedidosHoje = completedOrders.filter(
      (o) => o.timestamp >= today.getTime()
    )
    const pedidosSemana = completedOrders.filter(
      (o) => o.timestamp >= weekAgo.getTime()
    )
    const pedidosMes = completedOrders.filter(
      (o) => o.timestamp >= monthAgo.getTime()
    )

    // Calcular totais
    const totalHoje = pedidosHoje.reduce((sum, o) => sum + o.total, 0)
    const totalSemana = pedidosSemana.reduce((sum, o) => sum + o.total, 0)
    const totalMes = pedidosMes.reduce((sum, o) => sum + o.total, 0)

    // Produto mais vendido
    const produtoCount: Record<string, number> = {}
    completedOrders.forEach((order) => {
      order.items.forEach((item) => {
        produtoCount[item.name] = (produtoCount[item.name] || 0) + item.quantity
      })
    })

    const produtoMaisVendido = Object.entries(produtoCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || 'Nenhum'

    // Ticket médio
    const ticketMedio = completedOrders.length > 0
      ? completedOrders.reduce((sum, o) => sum + o.total, 0) / completedOrders.length
      : 0

    return {
      pedidosHoje: pedidosHoje.length,
      pedidosSemana: pedidosSemana.length,
      pedidosMes: pedidosMes.length,
      totalHoje,
      totalSemana,
      totalMes,
      produtoMaisVendido,
      ticketMedio,
      historicoCompleto: completedOrders,
    }
  }

  const stats = getStats()

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
        completeOrder,
        stats,
        getStats,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }
  return context
}
