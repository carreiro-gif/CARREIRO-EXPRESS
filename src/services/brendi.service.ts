// src/services/brendi.service.ts

/**
 * Service para comunicação com a API da Brendi
 * Usa as API Routes do Vercel para esconder credenciais
 */

/**
 * Tipagens
 */
export interface BrendiProduct {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  categoryId: string
  active: boolean
  observations?: string
}

export interface BrendiCategory {
  id: string
  name: string
  description?: string
  position: number
  active: boolean
}

export interface BrendiMenuResponse {
  categories: BrendiCategory[]
  products: BrendiProduct[]
}

export interface OrderItem {
  productId: string
  quantity: number
  observations?: string
  price: number
}

export interface OrderPayload {
  items: OrderItem[]
  customer?: {
    name?: string
    phone?: string
  }
  paymentMethod: string
  total: number
  observations?: string
}

export interface OrderResponse {
  orderId: string
  status: string
  message: string
  createdAt: string
}

/**
 * Classe de serviço da Brendi
 */
class BrendiService {
  private baseUrl = '/api/brendi'

  /**
   * Busca o cardápio completo
   */
  async getMenu(): Promise<BrendiMenuResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao carregar cardápio')
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Erro ao buscar cardápio:', error)
      throw error
    }
  }

  /**
   * Busca apenas produtos ativos
   */
  async getActiveProducts(): Promise<BrendiProduct[]> {
    const menu = await this.getMenu()
    return menu.products.filter(product => product.active)
  }

  /**
   * Busca apenas categorias ativas
   */
  async getActiveCategories(): Promise<BrendiCategory[]> {
    const menu = await this.getMenu()
    return menu.categories.filter(category => category.active)
  }

  /**
   * Busca produtos por categoria
   */
  async getProductsByCategory(categoryId: string): Promise<BrendiProduct[]> {
    const products = await this.getActiveProducts()
    return products.filter(product => product.categoryId === categoryId)
  }

  /**
   * Cria um novo pedido
   */
  async createOrder(orderData: OrderPayload): Promise<OrderResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erro ao criar pedido')
      }

      return await response.json()
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error)
      throw error
    }
  }
}

// Exportar instância única (singleton)
export const brendiService = new BrendiService()

/**
 * Hook para usar dados mockados em desenvolvimento
 * (caso as credenciais não estejam configuradas)
 */
export const useMockData = import.meta.env.MODE === 'development' && 
  !import.meta.env.VITE_BRENDI_API_URL

/**
 * Dados mockados para desenvolvimento
 */
export const mockMenu: BrendiMenuResponse = {
  categories: [
    {
      id: 'cat-1',
      name: 'Hambúrgueres',
      description: 'Nossos deliciosos hambúrgueres artesanais',
      position: 1,
      active: true,
    },
    {
      id: 'cat-2',
      name: 'Bebidas',
      description: 'Refrigerantes e sucos',
      position: 2,
      active: true,
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'X-Burger Clássico',
      description: 'Hambúrguer artesanal, queijo, alface, tomate',
      price: 25.90,
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Hambúrgueres',
      categoryId: 'cat-1',
      active: true,
    },
    {
      id: 'prod-2',
      name: 'X-Bacon',
      description: 'Hambúrguer artesanal, bacon, queijo, cebola caramelizada',
      price: 29.90,
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Hambúrgueres',
      categoryId: 'cat-1',
      active: true,
    },
    {
      id: 'prod-3',
      name: 'Coca-Cola 350ml',
      description: 'Refrigerante gelado',
      price: 5.00,
      imageUrl: 'https://via.placeholder.com/300',
      category: 'Bebidas',
      categoryId: 'cat-2',
      active: true,
    },
  ],
}
