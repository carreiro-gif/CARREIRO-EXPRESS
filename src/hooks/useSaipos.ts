// src/hooks/useSaipos.ts
// Hook React para integração com Saipos

import { useState } from 'react'

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  integration_code?: string
  notes?: string
}

interface CreateOrderResponse {
  success: boolean
  order_id?: string
  display_id?: string
  error?: string
}

export function useSaipos() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = async (
    items: OrderItem[],
    totalAmount: number,
    notes?: string
  ): Promise<CreateOrderResponse> => {
    setLoading(true)
    setError(null)

    try {
      const saiposItems = items.map((item) => ({
        integration_code: item.integration_code || item.id,
        desc_item: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        notes: item.notes || '',
      }))

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: saiposItems,
          total_amount: totalAmount,
          notes: notes || '',
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao criar pedido')
      }

      return {
        success: true,
        order_id: data.order_id,
        display_id: data.display_id,
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar pedido'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return { createOrder, loading, error }
}
