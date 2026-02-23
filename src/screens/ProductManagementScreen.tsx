// src/screens/ProductManagementScreen.tsx
// Gerenciamento de cardápio COMPLETO - Igual Brendi

import React, { useState } from 'react'
import { useProducts } from '../context/ProductsContext'
import type { Product, Category } from '../types/product-types'

const ProductManagementScreen: React.FC = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
  } = useProducts()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [editingProduct, setEditingProduct] = useState(false)

  // Novo produto template
  const newProductTemplate = (): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> => ({
    name: '',
    description: '',
    category_id: selectedCategory || categories[0]?.id || '',
    integration_code: '',
    price: 0,
    discount_enabled: false,
    discount_value: 0,
    discount_price: 0,
    portion_size: 'unidade',
    serves_up_to: '1 pessoa',
    status: 'active',
    image_url: '',
    featured: false,
    allow_share: true,
    mandatory_scheduling: false,
    complements: []
  })

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, productData)
    } else {
      addProduct(productData as any)
    }
    setEditingProduct(false)
    setSelectedProduct(null)
  }

  const productsToShow = selectedCategory 
    ? getProductsByCategory(selectedCategory)
    : products

  return (
    <div style={styles.container}>
      {/* Sidebar - Categorias */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Categorias</h2>
          <button style={styles.addCategoryBtn} onClick={() => {/* TODO */}}>
            + Nova categoria
          </button>
        </div>

        <div style={styles.categoriesList}>
          {categories.map(category => (
            <div
              key={category.id}
              style={{
                ...styles.categoryItem,
                ...(selectedCategory === category.id ? styles.categoryItemActive : {})
              }}
              onClick={() => setSelectedCategory(category.id)}
            >
              <label style={styles.categoryToggle}>
                <input
                  type="checkbox"
                  checked={category.active}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateCategory(category.id, { active: e.target.checked })
                  }}
                  style={styles.toggleInput}
                />
                <span style={{
                  ...styles.toggleSlider,
                  backgroundColor: category.active ? '#10B981' : '#9CA3AF'
                }} />
              </label>
              <span style={styles.categoryEmoji}>{category.emoji}</span>
              <span style={styles.categoryName}>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {!editingProduct ? (
          <>
            {/* Lista de Produtos */}
            <div style={styles.productsHeader}>
              <h2 style={styles.productsTitle}>
                Produtos {selectedCategory && `- ${categories.find(c => c.id === selectedCategory)?.name}`}
              </h2>
              <button
                style={styles.addProductBtn}
                onClick={() => {
                  setEditingProduct(true)
                  setSelectedProduct(null)
                }}
              >
                + Novo produto
              </button>
            </div>

            <div style={styles.productsList}>
              {productsToShow.length === 0 ? (
                <div style={styles.emptyState}>
                  <p>Nenhum produto cadastrado</p>
                  <button
                    style={styles.addProductBtn}
                    onClick={() => {
                      setEditingProduct(true)
                      setSelectedProduct(null)
                    }}
                  >
                    + Adicionar primeiro produto
                  </button>
                </div>
              ) : (
                productsToShow.map(product => (
                  <div
                    key={product.id}
                    style={styles.productCard}
                    onClick={() => {
                      setSelectedProduct(product)
                      setEditingProduct(true)
                    }}
                  >
                    {product.image_url && (
                      <img src={product.image_url} alt={product.name} style={styles.productImage} />
                    )}
                    <div style={styles.productInfo}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <p style={styles.productCode}>Código: {product.integration_code || 'Sem código'}</p>
                      <div style={styles.productPrice}>
                        {product.discount_enabled ? (
                          <>
                            <span style={styles.priceOriginal}>R$ {product.price.toFixed(2)}</span>
                            <span style={styles.priceDiscounted}>R$ {product.discount_price.toFixed(2)}</span>
                          </>
                        ) : (
                          <span style={styles.priceNormal}>R$ {product.price.toFixed(2)}</span>
                        )}
                      </div>
                      <span style={{
                        ...styles.productStatus,
                        backgroundColor: product.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                        color: product.status === 'active' ? '#065F46' : '#991B1B'
                      }}>
                        {product.status === 'active' ? 'Ativo' : product.status === 'inactive' ? 'Inativo' : 'Em falta'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Formulário de Edição */
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(false)
              setSelectedProduct(null)
            }}
            onDelete={selectedProduct ? () => {
              if (confirm('Tem certeza que deseja deletar este produto?')) {
                deleteProduct(selectedProduct.id)
                setEditingProduct(false)
                setSelectedProduct(null)
              }
            } : undefined}
          />
        )}
      </div>
    </div>
  )
}

// Componente do Formulário
const ProductForm: React.FC<{
  product: Product | null
  categories: Category[]
  onSave: (data: Partial<Product>) => void
  onCancel: () => void
  onDelete?: () => void
}> = ({ product, categories, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      category_id: categories[0]?.id || '',
      integration_code: '',
      price: 0,
      discount_enabled: false,
      discount_value: 0,
      discount_price: 0,
      status: 'active',
      complements: []
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeader}>
        <button type="button" onClick={onCancel} style={styles.backBtn}>
          ← Voltar
        </button>
        <h2 style={styles.formTitle}>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {onDelete && (
            <button type="button" onClick={onDelete} style={styles.deleteBtn}>
              🗑️ Deletar
            </button>
          )}
          <button type="submit" style={styles.saveBtn}>
            💾 Salvar Produto
          </button>
        </div>
      </div>

      <div style={styles.formContent}>
        {/* Nome */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome do produto *</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            required
          />
        </div>

        {/* Descrição */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Descrição do produto</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.textarea}
            rows={3}
          />
        </div>

        {/* Categoria */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Categoria *</label>
          <select
            value={formData.category_id || ''}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            style={styles.select}
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Código PDV - SAIPOS ⭐ */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Código PDV (Integração Saipos) * ⭐
          </label>
          <input
            type="text"
            value={formData.integration_code || ''}
            onChange={(e) => setFormData({ ...formData, integration_code: e.target.value })}
            style={styles.input}
            placeholder="Ex: 23373784"
            required
          />
          <small style={styles.hint}>
            Este código identifica o produto na Saipos
          </small>
        </div>

        {/* Preço */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Preço *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price || 0}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            style={styles.input}
            required
          />
        </div>

        {/* Desconto */}
        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.discount_enabled || false}
              onChange={(e) => setFormData({ ...formData, discount_enabled: e.target.checked })}
            />
            Adicionar desconto
          </label>
        </div>

        {formData.discount_enabled && (
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Desconto (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_value || 0}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0
                  const price = formData.price || 0
                  const discountPrice = price - (price * discount / 100)
                  setFormData({
                    ...formData,
                    discount_value: discount,
                    discount_price: discountPrice
                  })
                }}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Preço com desconto</label>
              <input
                type="number"
                step="0.01"
                value={formData.discount_price || 0}
                readOnly
                style={styles.inputReadonly}
              />
            </div>
          </div>
        )}

        {/* Status */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Status</label>
          <div style={styles.statusButtons}>
            {['active', 'inactive', 'unavailable'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData({ ...formData, status: status as any })}
                style={{
                  ...styles.statusBtn,
                  ...(formData.status === status ? styles.statusBtnActive : {})
                }}
              >
                {status === 'active' ? 'Ativo' : status === 'inactive' ? 'Inativo' : 'Em falta'}
              </button>
            ))}
          </div>
        </div>

        {/* Complementos - TODO: Adicionar editor */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Complementos/Adicionais</label>
          <button type="button" style={styles.addComplementBtn}>
            + Adicionar complemento
          </button>
        </div>
      </div>
    </form>
  )
}

// Continua com os estilos...
const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
  },

  sidebar: {
    width: '280px',
    backgroundColor: '#FFF',
    borderRight: '1px solid #E5E7EB',
    padding: '1.5rem',
    overflowY: 'auto',
  },

  sidebarHeader: {
    marginBottom: '1.5rem',
  },

  sidebarTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  addCategoryBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#E11D48',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    backgroundColor: '#F9FAFB',
  },

  categoryItemActive: {
    backgroundColor: '#FEE2E2',
    borderLeft: '3px solid #E11D48',
  },

  categoryToggle: {
    position: 'relative',
    width: '44px',
    height: '24px',
    cursor: 'pointer',
  },

  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },

  toggleSlider: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '24px',
    transition: 'background-color 150ms',
  },

  categoryEmoji: {
    fontSize: '1.25rem',
  },

  categoryName: {
    fontSize: '0.95rem',
    fontWeight: 500,
    flex: 1,
  },

  main: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  },

  productsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },

  productsTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },

  addProductBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  productsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },

  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '4rem',
    color: '#6B7280',
  },

  productCard: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 150ms, box-shadow 150ms',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  productImage: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },

  productInfo: {
    padding: '1rem',
  },

  productName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },

  productCode: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '0.75rem',
  },

  productPrice: {
    marginBottom: '0.75rem',
  },

  priceOriginal: {
    textDecoration: 'line-through',
    color: '#9CA3AF',
    marginRight: '0.5rem',
  },

  priceDiscounted: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#E11D48',
  },

  priceNormal: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
  },

  productStatus: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 500,
  },

  form: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    padding: '2rem',
  },

  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #E5E7EB',
  },

  backBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  formTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    flex: 1,
    textAlign: 'center',
  },

  deleteBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#EF4444',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  saveBtn: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  formContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  label: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#374151',
  },

  input: {
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },

  inputReadonly: {
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#F9FAFB',
  },

  textarea: {
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
  },

  select: {
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#FFF',
  },

  hint: {
    fontSize: '0.875rem',
    color: '#6B7280',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
  },

  statusButtons: {
    display: 'flex',
    gap: '0.75rem',
  },

  statusBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid #D1D5DB',
    borderRadius: '9999px',
    backgroundColor: '#FFF',
    cursor: 'pointer',
    fontWeight: 500,
  },

  statusBtnActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#E11D48',
    color: '#E11D48',
  },

  addComplementBtn: {
    padding: '0.75rem',
    border: '2px dashed #D1D5DB',
    borderRadius: '0.5rem',
    backgroundColor: 'transparent',
    color: '#6B7280',
    cursor: 'pointer',
    fontWeight: 500,
  },
}

export default ProductManagementScreen
