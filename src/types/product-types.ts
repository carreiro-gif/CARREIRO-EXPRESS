// src/types/product-types.ts - ATUALIZADO COM TIPOS DE COMPLEMENTO

export type ComplementType = 'single' | 'multiple' | 'addable'

export interface Category {
  id: string
  name: string
  emoji?: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface ComplementOption {
  id: string
  name: string
  price: number
  integration_code: string // ⭐ CÓDIGO SAIPOS
  status: 'active' | 'inactive' | 'unavailable'
  order: number
}

export interface ProductComplement {
  id: string
  name: string
  emoji?: string
  type: ComplementType // ⭐ 'single' | 'multiple' | 'addable'
  required: boolean
  min_quantity: number // Cliente escolhe DE
  max_quantity: number // Cliente escolhe ATÉ
  status: 'active' | 'inactive' | 'unavailable'
  options: ComplementOption[]
  order: number
}

export interface Product {
  id: string
  name: string
  description: string
  category_id: string
  
  // INTEGRAÇÃO SAIPOS ⭐
  integration_code: string
  
  // Preço e desconto
  price: number
  discount_enabled: boolean
  discount_value: number
  discount_price: number
  
  // Porção e status
  portion_size: string
  serves_up_to: string
  status: 'active' | 'inactive' | 'unavailable'
  
  // Imagem
  image_url: string
  
  // Opções
  featured: boolean
  allow_share: boolean
  mandatory_scheduling: boolean
  
  // Complementos ⭐
  complements: ProductComplement[]
  
  // Metadados
  createdAt: string
  updatedAt: string
}

export interface CartProduct {
  product: Product
  quantity: number
  selected_complements: {
    complement_id: string
    option_ids: string[]
    quantities?: { [option_id: string]: number } // Para tipo 'addable'
  }[]
  total_price: number
  notes?: string
}

// Para importação
export interface ImportData {
  categories: Category[]
  products: Product[]
  imported_at: string
  source: string
}
