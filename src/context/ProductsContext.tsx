// src/context/ProductsContext.tsx
// Context para gerenciar produtos e categorias

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Category, Product } from '../types/product-types'

interface ProductsContextType {
  // Categorias
  categories: Category[]
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCategory: (id: string, data: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Produtos
  products: Product[]
  getProductsByCategory: (categoryId: string) => Product[]
  getActiveProducts: () => Product[]
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, data: Partial<Product>) => void
  deleteProduct: (id: string) => void
  getProduct: (id: string) => Product | undefined
  
  // Importação
  importFromBrendi: (data: { categories: Category[], products: Product[] }) => void
  exportData: () => { categories: Category[], products: Product[] }
  
  // Reset
  clearAll: () => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

const STORAGE_CATEGORIES = 'carreiro-categories'
const STORAGE_PRODUCTS = 'carreiro-products'

// Dados iniciais
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'BOM E BARATO',
    emoji: '💰',
    active: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Hambúrgueres',
    emoji: '🍔',
    active: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Acompanhamentos',
    emoji: '🍟',
    active: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Bebidas',
    emoji: '🥤',
    active: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'X-Bacon',
    description: 'Hambúrguer artesanal com bacon crocante, queijo, alface e tomate',
    category_id: '2',
    integration_code: 'XBACON-001',
    price: 25.90,
    discount_enabled: false,
    discount_value: 0,
    discount_price: 25.90,
    portion_size: 'unidade',
    serves_up_to: '1 pessoa',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    featured: true,
    allow_share: true,
    mandatory_scheduling: false,
    complements: [
      {
        id: 'comp-1',
        name: 'Adicionar extras',
        emoji: '🧀',
        required: false,
        multiple: true,
        options: [
          { id: 'opt-1', name: 'Bacon extra', price: 5.00, integration_code: 'BACON-EXTRA' },
          { id: 'opt-2', name: 'Queijo extra', price: 3.00, integration_code: 'QUEIJO-EXTRA' },
          { id: 'opt-3', name: 'Ovo', price: 2.00, integration_code: 'OVO' },
        ]
      },
      {
        id: 'comp-2',
        name: 'Remover ingredientes',
        emoji: '🚫',
        required: false,
        multiple: true,
        options: [
          { id: 'opt-4', name: 'Sem cebola', price: 0, integration_code: 'SEM-CEBOLA' },
          { id: 'opt-5', name: 'Sem tomate', price: 0, integration_code: 'SEM-TOMATE' },
        ]
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS)
  const [loaded, setLoaded] = useState(false)

  // Carregar do localStorage
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(STORAGE_CATEGORIES)
      const savedProducts = localStorage.getItem(STORAGE_PRODUCTS)

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      }

      console.log('✅ Produtos carregados:', savedProducts ? JSON.parse(savedProducts).length : 0)
    } catch (error) {
      console.error('❌ Erro ao carregar produtos:', error)
    } finally {
      setLoaded(true)
    }
  }, [])

  // Salvar categorias
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_CATEGORIES, JSON.stringify(categories))
    } catch (error) {
      console.error('❌ Erro ao salvar categorias:', error)
    }
  }, [categories, loaded])

  // Salvar produtos
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products))
    } catch (error) {
      console.error('❌ Erro ao salvar produtos:', error)
    }
  }, [products, loaded])

  // Categorias
  const addCategory = (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCategory: Category = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setCategories(prev => [...prev, newCategory])
  }

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, ...data, updatedAt: new Date().toISOString() } : cat
      )
    )
  }

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id))
    // Desativar produtos da categoria
    setProducts(prev =>
      prev.map(prod =>
        prod.category_id === id ? { ...prod, status: 'inactive' as const } : prod
      )
    )
  }

  // Produtos
  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.category_id === categoryId)
  }

  const getActiveProducts = () => {
    return products.filter(p => p.status === 'active')
  }

  const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setProducts(prev => [...prev, newProduct])
  }

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev =>
      prev.map(prod =>
        prod.id === id ? { ...prod, ...data, updatedAt: new Date().toISOString() } : prod
      )
    )
  }

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id))
  }

  const getProduct = (id: string) => {
    return products.find(p => p.id === id)
  }

  // Importação/Exportação
  const importFromBrendi = (data: { categories: Category[], products: Product[] }) => {
    setCategories(data.categories)
    setProducts(data.products)
    console.log('✅ Importado:', data.products.length, 'produtos')
  }

  const exportData = () => {
    return { categories, products }
  }

  const clearAll = () => {
    setCategories(DEFAULT_CATEGORIES)
    setProducts(DEFAULT_PRODUCTS)
    localStorage.removeItem(STORAGE_CATEGORIES)
    localStorage.removeItem(STORAGE_PRODUCTS)
  }

  if (!loaded) {
    return <div>Carregando produtos...</div>
  }

  return (
    <ProductsContext.Provider
      value={{
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        products,
        getProductsByCategory,
        getActiveProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        importFromBrendi,
        exportData,
        clearAll,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = (): ProductsContextType => {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}
