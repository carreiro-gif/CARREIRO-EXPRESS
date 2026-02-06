export interface BrendiProduct {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  available: boolean
}

export interface BrendiCategory {
  id: string
  name: string
  icon?: string
}

class BrendiService {
  private baseUrl = '/api/brendi'

  async getMenu() {
    const response = await fetch(`${this.baseUrl}/menu`)
    if (!response.ok) throw new Error('Erro ao buscar cardápio')
    return await response.json()
  }

  async createOrder(orderData: any) {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    })
    if (!response.ok) throw new Error('Erro ao criar pedido')
    return await response.json()
  }
}

export const brendiService = new BrendiService()
