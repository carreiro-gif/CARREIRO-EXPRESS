// src/screens/AdminScreen.tsx
// PASSO 3: Com aba Cardápio

import ImageUploader from '../components/products/ImageUploader'
import React, { useState } from 'react'
import { useConfig } from '../context/ConfigContext'
import { useProducts } from '../context/ProductsContext'

type AdminTab = 'geral' | 'carrossel' | 'aparencia' | 'pagamento' | 'estatisticas' | 'cardapio'

interface AdminScreenProps {
  onClose: () => void
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')
  const { config, updateConfig } = useConfig()
  
  // Tentar usar ProductsContext
  let productsContext: any = null
  try {
    productsContext = useProducts()
  } catch (err) {
    console.log('ProductsContext não disponível')
  }

  const tabs = [
    { id: 'geral' as AdminTab, label: 'Geral', icon: '⚙️' },
    { id: 'carrossel' as AdminTab, label: 'Carrossel', icon: '🎬' },
    { id: 'aparencia' as AdminTab, label: 'Aparência', icon: '🎨' },
    { id: 'pagamento' as AdminTab, label: 'Pagamento', icon: '💳' },
    { id: 'estatisticas' as AdminTab, label: 'Estatísticas', icon: '📊' },
    { id: 'cardapio' as AdminTab, label: 'Cardápio', icon: '🗂️' },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'geral':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Configurações Gerais</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Nome da Loja</label>
              <input
                type="text"
                value={config.storeName}
                onChange={(e) => updateConfig({ storeName: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Endereço</label>
              <input
                type="text"
                value={config.storeAddress}
                onChange={(e) => updateConfig({ storeAddress: e.target.value })}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Telefone</label>
              <input
                type="text"
                value={config.storePhone}
                onChange={(e) => updateConfig({ storePhone: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>
        )

      case 'carrossel':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Imagens do Carrossel</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={config.carouselEnabled}
                  onChange={(e) => updateConfig({ carouselEnabled: e.target.checked })}
                  style={styles.checkbox}
                />
                Habilitar Carrossel
              </label>
            </div>

            {config.carouselEnabled && (
              <div style={styles.formGroup}>
                <label style={styles.label}>URLs das Imagens (uma por linha)</label>
                <textarea
                  value={config.carouselImages.join('\n')}
                  onChange={(e) => updateConfig({ 
                    carouselImages: e.target.value.split('\n').filter(url => url.trim()) 
                  })}
                  style={styles.textarea}
                  rows={6}
                  placeholder="https://exemplo.com/imagem1.jpg"
                />
              </div>
            )}
          </div>
        )

      case 'aparencia':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Aparência</h2>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Cor Principal</label>
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                style={styles.colorInput}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cor Secundária</label>
              <input
                type="color"
                value={config.secondaryColor}
                onChange={(e) => updateConfig({ secondaryColor: e.target.value })}
                style={styles.colorInput}
              />
            </div>
          </div>
        )

      case 'pagamento':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Formas de Pagamento</h2>
            <p style={styles.description}>
              Selecione as formas de pagamento aceitas
            </p>

            {['dinheiro', 'debito', 'credito', 'pix', 'vale-alimentacao', 'vale-refeicao'].map(method => (
              <div key={method} style={styles.formGroup}>
                <label style={styles.label}>
                  <input
                    type="checkbox"
                    checked={config.paymentMethods.includes(method)}
                    onChange={(e) => {
                      const newMethods = e.target.checked
                        ? [...config.paymentMethods, method]
                        : config.paymentMethods.filter(m => m !== method)
                      updateConfig({ paymentMethods: newMethods })
                    }}
                    style={styles.checkbox}
                  />
                  {method === 'dinheiro' ? '💵 Dinheiro' :
                   method === 'debito' ? '💳 Cartão Débito' :
                   method === 'credito' ? '💳 Cartão Crédito' :
                   method === 'pix' ? '🔷 Pix' :
                   method === 'vale-alimentacao' ? '🍽️ Vale Alimentação' :
                   '🍽️ Vale Refeição'}
                </label>
              </div>
            ))}
          </div>
        )

      case 'estatisticas':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Estatísticas</h2>
            
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Pedidos Hoje</div>
                <div style={styles.statValue}>0</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Faturamento</div>
                <div style={styles.statValue}>R$ 0,00</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Ticket Médio</div>
                <div style={styles.statValue}>R$ 0,00</div>
              </div>
            </div>
          </div>
        )

      case 'cardapio':
        return <CardapioTab productsContext={productsContext} />

      default:
        return null
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚙️ Painel Admin</h1>
          <button onClick={onClose} style={styles.closeButton}>
            ✕ Fechar
          </button>
        </div>

        <div style={styles.container}>
          <div style={styles.sidebar}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.tab,
                  ...(activeTab === tab.id ? styles.tabActive : {})
                }}
              >
                <span style={styles.tabIcon}>{tab.icon}</span>
                <span style={styles.tabLabel}>{tab.label}</span>
              </button>
            ))}
          </div>

          <div style={styles.content}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente da Aba Cardápio
const CardapioTab: React.FC<{ productsContext: any }> = ({ productsContext }) => {
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  if (!productsContext) {
    return (
      <div style={styles.tabContent}>
        <h2 style={styles.sectionTitle}>Gerenciamento de Cardápio</h2>
        <div style={styles.emptyState}>
          <p>ProductsContext não está disponível.</p>
          <p>Certifique-se de que ProductsProvider está no App.tsx</p>
        </div>
      </div>
    )
  }

  const { products, categories, addProduct, updateProduct, deleteProduct, getProductsByCategory } = productsContext

  const productsToShow = selectedCategory 
    ? getProductsByCategory(selectedCategory)
    : products

  if (editingProduct !== null) {
    return (
      <ProductForm
        product={editingProduct === 'new' ? null : editingProduct}
        categories={categories}
        onSave={(data) => {
          if (editingProduct === 'new') {
            addProduct(data)
          } else {
            updateProduct(editingProduct.id, data)
          }
          setEditingProduct(null)
        }}
        onCancel={() => setEditingProduct(null)}
        onDelete={editingProduct !== 'new' ? () => {
          if (confirm('Tem certeza que deseja deletar este produto?')) {
            deleteProduct(editingProduct.id)
            setEditingProduct(null)
          }
        } : undefined}
      />
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Sidebar Categorias */}
      <div style={styles.cardapioSidebar}>
        <h3 style={styles.sidebarTitle}>Categorias</h3>
        <div style={styles.categoriesList}>
          <button
            onClick={() => setSelectedCategory(null)}
            style={{
              ...styles.categoryItem,
              ...(selectedCategory === null ? styles.categoryItemActive : {})
            }}
          >
            Todas
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryItem,
                ...(selectedCategory === cat.id ? styles.categoryItemActive : {})
              }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Produtos */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={styles.productsHeader}>
          <h2 style={styles.sectionTitle}>
            Produtos {selectedCategory && `- ${categories.find((c: any) => c.id === selectedCategory)?.name}`}
          </h2>
          <button
            style={styles.addProductBtn}
            onClick={() => setEditingProduct('new')}
          >
            + Novo Produto
          </button>
        </div>

        <div style={styles.productsList}>
          {productsToShow.length === 0 ? (
            <div style={styles.emptyState}>
              <p>Nenhum produto cadastrado</p>
              <button
                style={styles.addProductBtn}
                onClick={() => setEditingProduct('new')}
              >
                + Adicionar primeiro produto
              </button>
            </div>
          ) : (
            productsToShow.map((product: any) => (
              <div
                key={product.id}
                style={styles.productCard}
                onClick={() => setEditingProduct(product)}
              >
                <div style={styles.productCardInfo}>
                  <h3 style={styles.productCardName}>{product.name}</h3>
                  <p style={styles.productCardCode}>Código: {product.integration_code || 'Sem código'}</p>
                  <div style={styles.productCardPrice}>
                    {product.discount_enabled ? (
                      <>
                        <span style={styles.priceOriginal}>R$ {product.price.toFixed(2)}</span>
                        <span style={styles.priceDiscounted}>R$ {product.discount_price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span style={styles.priceNormal}>R$ {product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <span style={{
                  ...styles.productStatus,
                  backgroundColor: product.status === 'active' ? '#D1FAE5' : '#FEE2E2',
                  color: product.status === 'active' ? '#065F46' : '#991B1B'
                }}>
                  {product.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Formulário de Produto
const ProductForm: React.FC<{
  product: any
  categories: any[]
  onSave: (data: any) => void
  onCancel: () => void
  onDelete?: () => void
}> = ({ product, categories, onSave, onCancel, onDelete }) => {
  const [formData, setFormData] = useState(
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
      image_url: '',
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
            💾 Salvar
          </button>
        </div>
      </div>

      <div style={styles.formContent}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Nome do produto *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Descrição</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.textarea}
            rows={3}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Categoria *</label>
          <select
            value={formData.category_id}
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

        <div style={styles.formGroup}>
          <label style={styles.label}>Código PDV (Saipos) * ⭐</label>
          <input
            type="text"
            value={formData.integration_code}
            onChange={(e) => setFormData({ ...formData, integration_code: e.target.value })}
            style={styles.input}
            placeholder="Ex: 23373784"
            required
          />
          <small style={styles.hint}>
            Este código identifica o produto na Saipos
          </small>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Preço *</label>
          <input
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={formData.discount_enabled}
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
                value={formData.discount_value}
                onChange={(e) => {
                  const discount = parseFloat(e.target.value) || 0
                  const discountPrice = formData.price - (formData.price * discount / 100)
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
                value={formData.discount_price}
                readOnly
                style={styles.inputReadonly}
              />
            </div>
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Status</label>
          <div style={styles.statusButtons}>
            {['active', 'inactive', 'unavailable'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFormData({ ...formData, status })}
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

        <div style={styles.formGroup}>
  <ImageUploader
    currentImageUrl={formData.image_url}
    onImageChange={(imageData) =>
      setFormData({ ...formData, image_url: imageData })
    }
    label="Imagem do Produto"
  />
</div>
      </div>
    </form>
  )
}

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    width: '95%',
    maxWidth: '1400px',
    height: '90vh',
    backgroundColor: '#FFF',
    borderRadius: '1rem',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
    borderBottom: '1px solid #E5E7EB',
  },

  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },

  closeButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#EF4444',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
  },

  container: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  sidebar: {
    width: '250px',
    backgroundColor: '#F9FAFB',
    borderRight: '1px solid #E5E7EB',
    padding: '1rem',
    overflowY: 'auto',
  },

  tab: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    marginBottom: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 150ms',
    textAlign: 'left',
  },

  tabActive: {
    backgroundColor: '#E11D48',
    color: '#FFF',
  },

  tabIcon: {
    fontSize: '1.25rem',
  },

  tabLabel: {
    fontSize: '1rem',
    fontWeight: 600,
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: '#FFF',
  },

  tabContent: {
    padding: '2rem',
  },

  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  description: {
    fontSize: '0.95rem',
    color: '#6B7280',
    marginBottom: '1.5rem',
  },

  formGroup: {
    marginBottom: '1.5rem',
  },

  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },

  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },

  select: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },

  colorInput: {
    width: '100px',
    height: '50px',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  checkbox: {
    marginRight: '0.5rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },

  statCard: {
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.75rem',
    border: '1px solid #E5E7EB',
  },

  statLabel: {
    fontSize: '0.95rem',
    color: '#6B7280',
    marginBottom: '0.5rem',
  },

  statValue: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#111827',
  },

  cardapioSidebar: {
    width: '250px',
    backgroundColor: '#F9FAFB',
    borderRight: '1px solid #E5E7EB',
    padding: '1.5rem',
    overflowY: 'auto',
  },

  sidebarTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  categoriesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },

  categoryItem: {
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.95rem',
    fontWeight: 500,
    transition: 'background-color 150ms',
  },

  categoryItemActive: {
    backgroundColor: '#FEE2E2',
    color: '#E11D48',
    fontWeight: 600,
  },

  productsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
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
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#6B7280',
  },

  productCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'background-color 150ms',
  },

  productCardInfo: {
    flex: 1,
  },

  productCardName: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },

  productCardCode: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginBottom: '0.5rem',
  },

  productCardPrice: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },

  priceOriginal: {
    fontSize: '0.875rem',
    color: '#9CA3AF',
    textDecoration: 'line-through',
  },

  priceDiscounted: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#E11D48',
  },

  priceNormal: {
    fontSize: '1.125rem',
    fontWeight: 700,
  },

  productStatus: {
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: 600,
  },

  form: {
    padding: '2rem',
    overflowY: 'auto',
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

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  hint: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.25rem',
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
  },

  inputReadonly: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    backgroundColor: '#F9FAFB',
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
}

export default AdminScreen
