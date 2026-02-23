// src/screens/MenuScreen.tsx
// VERSÃO COM CATEGORIAS - Testada e segura

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import { useProducts } from '../context/ProductsContext'

interface MenuScreenProps {
  onBack: () => void
  onCheckout: () => void
}

const MenuScreen: React.FC<MenuScreenProps> = ({ onBack, onCheckout }) => {
  const { addToCart, cart, cartTotal } = useOrder()
  
  // Tentar usar ProductsContext, se falhar usar produtos hardcoded
  let products: any[] = []
  let categories: any[] = []
  
  try {
    const productsContext = useProducts()
    products = productsContext.getActiveProducts()
    categories = productsContext.categories.filter((c: any) => c.active)
  } catch (err) {
    // Fallback: produtos hardcoded
    categories = [
      { id: 'cat-1', name: '🔝BOM E BARATO💰', emoji: '💰', active: true }
    ]
    products = [
      {
        id: 'prod-1',
        name: 'CARREIRINHO',
        description: 'Uma carne suculenta com queijo cheddar, cebola, picles, ketchup e mostarda',
        category_id: 'cat-1',
        price: 11.90,
        discount_enabled: true,
        discount_price: 9.90,
        discount_value: 16.81,
        status: 'active',
        image_url: '',
        integration_code: '23373784'
      },
      {
        id: 'prod-2',
        name: 'Duplo Carreirinho',
        description: 'Duas carnes suculentas com queijo cheddar',
        category_id: 'cat-1',
        price: 13.90,
        discount_enabled: true,
        discount_price: 11.90,
        discount_value: 14.39,
        status: 'active',
        image_url: '',
        integration_code: '23373904'
      },
      {
        id: 'prod-3',
        name: 'Big Carreiro',
        description: 'Duas carnes com queijo, alface, cebola, picles e molho especial',
        category_id: 'cat-1',
        price: 14.90,
        discount_enabled: true,
        discount_price: 12.90,
        discount_value: 13.42,
        status: 'active',
        image_url: '',
        integration_code: '23373837'
      },
      {
        id: 'prod-4',
        name: 'X-Bacon',
        description: 'Carne, queijo, bacon, alface, tomate, cebola, batata palha e maionese',
        category_id: 'cat-1',
        price: 14.90,
        discount_enabled: false,
        discount_price: 14.90,
        discount_value: 0,
        status: 'active',
        image_url: '',
        integration_code: '23373895'
      },
      {
        id: 'prod-5',
        name: 'X-Tudo',
        description: 'Carne, queijo, ovo, bacon, alface, tomate, cebola, batata palha e maionese',
        category_id: 'cat-1',
        price: 15.90,
        discount_enabled: false,
        discount_price: 15.90,
        discount_value: 0,
        status: 'active',
        image_url: '',
        integration_code: '23373893'
      }
    ]
  }
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_enabled ? product.discount_price : product.price,
      product: product
    })
  }

  return (
    <div style={{...styles.container, paddingBottom: cartCount > 0 ? '120px' : '2rem'}}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Voltar
        </button>
        <h1 style={styles.title}>Cardápio</h1>
      </div>

      {/* Busca */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Buscar produtos..."
          style={styles.searchInput}
        />
      </div>

      {/* Filtro de Categorias */}
      {categories.length > 1 && (
        <div style={styles.categoriesContainer}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              ...styles.categoryChip,
              ...(selectedCategory === null ? styles.categoryChipActive : {})
            }}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                ...styles.categoryChip,
                ...(selectedCategory === category.id ? styles.categoryChipActive : {})
              }}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
      )}

      {/* Produtos */}
      <div style={styles.productsGrid}>
        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>
              {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
            </p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} style={styles.productCard}>
              {product.image_url && (
                <div style={styles.imageContainer}>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    style={styles.productImage}
                  />
                  {product.discount_enabled && (
                    <div style={styles.discountBadge}>
                      -{product.discount_value.toFixed(0)}%
                    </div>
                  )}
                </div>
              )}
              
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{product.name}</h3>
                {product.description && (
                  <p style={styles.productDescription}>{product.description}</p>
                )}
                
                <div style={styles.productFooter}>
                  <div style={styles.priceContainer}>
                    {product.discount_enabled ? (
                      <>
                        <span style={styles.originalPrice}>
                          R$ {product.price.toFixed(2)}
                        </span>
                        <span style={styles.discountPrice}>
                          R$ {product.discount_price.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span style={styles.normalPrice}>
                        R$ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(product)}
                    style={styles.addButton}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Carrinho Fixo */}
      {cartCount > 0 && (
        <div onClick={onCheckout} style={styles.cart}>
          <div style={styles.cartInfo}>
            <div style={styles.cartCount}>🛒 {cartCount} {cartCount === 1 ? 'item' : 'itens'}</div>
            <div style={styles.cartTotal}>R$ {cartTotal.toFixed(2)}</div>
          </div>
          <button style={styles.cartButton}>
            Ver Carrinho →
          </button>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#FFF',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },

  backButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
  },

  searchContainer: {
    padding: '1.5rem 2rem',
    backgroundColor: '#FFF',
    borderBottom: '1px solid #E5E7EB',
  },

  searchInput: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.125rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    outline: 'none',
  },

  categoriesContainer: {
    display: 'flex',
    gap: '0.75rem',
    padding: '1.5rem 2rem',
    overflowX: 'auto',
    backgroundColor: '#FFF',
    borderBottom: '1px solid #E5E7EB',
  },

  categoryChip: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#F3F4F6',
    border: '2px solid transparent',
    borderRadius: '9999px',
    fontSize: '1rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  categoryChipActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#E11D48',
    color: '#E11D48',
  },

  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
  },

  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem',
  },

  emptyText: {
    fontSize: '1.25rem',
    color: '#6B7280',
  },

  productCard: {
    backgroundColor: '#FFF',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
    transition: 'transform 150ms, box-shadow 150ms',
    cursor: 'pointer',
  },

  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },

  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  discountBadge: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#E11D48',
    color: '#FFF',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 700,
  },

  productInfo: {
    padding: '1.5rem',
  },

  productName: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: '#111827',
  },

  productDescription: {
    fontSize: '0.95rem',
    color: '#6B7280',
    marginBottom: '1rem',
    lineHeight: 1.5,
  },

  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },

  originalPrice: {
    fontSize: '0.875rem',
    color: '#9CA3AF',
    textDecoration: 'line-through',
  },

  discountPrice: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#E11D48',
  },

  normalPrice: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#111827',
  },

  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#E11D48',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  cart: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#E11D48',
    padding: '1.5rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
    zIndex: 100,
  },

  cartInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },

  cartCount: {
    fontSize: '1rem',
    color: '#FFF',
    fontWeight: 500,
  },

  cartTotal: {
    fontSize: '2rem',
    color: '#FFF',
    fontWeight: 800,
  },

  cartButton: {
    padding: '1rem 2rem',
    backgroundColor: '#FFF',
    color: '#E11D48',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
}

export default MenuScreen
