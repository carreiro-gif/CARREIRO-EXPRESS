// src/screens/AdminScreen.tsx

import React, { useState, useRef } from 'react'
import { theme } from '../theme/theme'
import { useConfig } from '../context/ConfigContext'

interface AdminScreenProps {
  onClose: () => void
}

type AdminTab = 
  | 'geral' 
  | 'carrossel' 
  | 'aparencia' 
  | 'formas-pagamento'
  | 'estatisticas'

interface CarouselImage {
  id: string
  file: File | null
  url: string
  title: string
  subtitle: string
}

interface PaymentMethod {
  id: string
  name: string
  icon: string
  enabled: boolean
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')

  // Estados para Geral
  const [storeName, setStoreName] = useState(config.storeName)
  const [buttonText, setButtonText] = useState(config.buttonText)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(config.logoUrl || '')
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Estados para Carrossel
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([
    { id: '1', file: null, url: '', title: '', subtitle: '' }
  ])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Estados para Aparência
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor)
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor)
  const [textColor, setTextColor] = useState('#111827')
  const [secondaryTextColor, setSecondaryTextColor] = useState('#6B7280')

  // Estados para Formas de Pagamento
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'debit', name: 'Débito', icon: '💳', enabled: true },
    { id: 'credit', name: 'Crédito', icon: '💳', enabled: true },
    { id: 'pix', name: 'PIX', icon: '📱', enabled: true },
    { id: 'cash', name: 'Dinheiro', icon: '💵', enabled: true },
    { id: 'meal-voucher', name: 'Vale Alimentação', icon: '🍱', enabled: true },
    { id: 'food-voucher', name: 'Vale Refeição', icon: '🍽️', enabled: true },
  ])

  // Estados para Estatísticas (mockados por enquanto)
  const [stats] = useState({
    pedidosHoje: 42,
    pedidosSemana: 285,
    pedidosMes: 1240,
    totalHoje: 1580.50,
    totalSemana: 10890.00,
    totalMes: 48720.00,
    produtoMaisVendido: 'X-Bacon',
    ticketMedio: 37.50,
  })

  // ========== FUNÇÕES DE UPLOAD ==========

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCarouselImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImages = [...carouselImages]
        newImages[index] = {
          ...newImages[index],
          file,
          url: reader.result as string,
        }
        setCarouselImages(newImages)
      }
      reader.readAsDataURL(file)
    }
  }

  const addCarouselSlide = () => {
    setCarouselImages([
      ...carouselImages,
      { id: Date.now().toString(), file: null, url: '', title: '', subtitle: '' }
    ])
  }

  const removeCarouselSlide = (index: number) => {
    setCarouselImages(carouselImages.filter((_, i) => i !== index))
  }

  // ========== DRAG & DROP DO CARROSSEL ==========

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...carouselImages]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)
    setCarouselImages(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // ========== SALVAR CONFIGURAÇÕES ==========

  const handleSave = () => {
    updateConfig({
      storeName,
      buttonText,
      backgroundColor,
      primaryColor,
      logoUrl: logoPreview || null,
    })
    alert('✅ Configurações salvas com sucesso!')
  }

  // ========== TABS ==========

  const tabs = [
    { id: 'geral' as AdminTab, label: 'Geral', icon: '⚙️' },
    { id: 'carrossel' as AdminTab, label: 'Carrossel', icon: '🎬' },
    { id: 'aparencia' as AdminTab, label: 'Aparência', icon: '🎨' },
    { id: 'formas-pagamento' as AdminTab, label: 'Pagamentos', icon: '💳' },
    { id: 'estatisticas' as AdminTab, label: 'Estatísticas', icon: '📊' },
  ]

  // ========== RENDERIZAR CONTEÚDO ==========

  const renderContent = () => {
    switch (activeTab) {
      case 'geral':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Configurações Gerais</h2>

            {/* Nome da Loja */}
            <div style={styles.field}>
              <label style={styles.label}>Nome da Loja</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={styles.input}
                placeholder="Ex: CARREIRO LANCHES"
              />
            </div>

            {/* Texto do Botão */}
            <div style={styles.field}>
              <label style={styles.label}>Texto do Botão Principal</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                style={styles.input}
                placeholder="Ex: PEÇA AQUI"
              />
            </div>

            {/* Upload de Logo */}
            <div style={styles.field}>
              <label style={styles.label}>Logo da Loja</label>
              <div style={styles.uploadArea}>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleLogoUpload}
                  style={styles.fileInput}
                />
                <button
                  type="button"
                  style={styles.uploadButton}
                  onClick={() => logoInputRef.current?.click()}
                >
                  📁 Escolher Imagem (JPG ou PNG)
                </button>
                <p style={styles.hint}>
                  Tamanho recomendado: 200x200px
                </p>
              </div>
              
              {/* Preview da Logo */}
              {logoPreview && (
                <div style={styles.imagePreviewBox}>
                  <p style={styles.previewLabel}>Preview:</p>
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    style={styles.logoPreviewImage}
                  />
                  <button
                    type="button"
                    style={styles.removeImageButton}
                    onClick={() => {
                      setLogoFile(null)
                      setLogoPreview('')
                    }}
                  >
                    🗑️ Remover Logo
                  </button>
                </div>
              )}
            </div>
          </div>
        )

      case 'carrossel':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Gerenciar Carrossel</h2>
            <p style={styles.description}>
              Adicione imagens, títulos e organize a ordem arrastando os slides.
            </p>
      case 'carrossel':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Gerenciar Carrossel</h2>
            <p style={styles.description}>
              Adicione imagens, títulos e organize a ordem arrastando os slides.
            </p>

            {/* Informação sobre tamanho ideal - MONITOR VERTICAL */}
            <div style={styles.imageSizeInfo}>
              <span style={styles.imageSizeIcon}>📐</span>
              <div>
                <p style={styles.imageSizeTitle}>Tamanho Recomendado para Monitor Vertical (em pé):</p>
                <p style={styles.imageSizeValue}>✅ 1080 x 1920 pixels (proporção 9:16)</p>
                <p style={styles.imageSizeHint}>
                  💡 Use imagens nessa proporção para melhor visualização no totem em pé
                </p>
              </div>
            </div>

            {/* Lista de Slides */}
            <div style={styles.carouselList}>

            {/* Lista de Slides */}
            <div style={styles.carouselList}>
              {carouselImages.map((slide, index) => (
                <div
                  key={slide.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    ...styles.carouselItem,
                    opacity: draggedIndex === index ? 0.5 : 1,
                  }}
                >
                  {/* Número do Slide */}
                  <div style={styles.slideNumber}>#{index + 1}</div>

                  {/* Upload de Imagem */}
                  <div style={styles.slideImageArea}>
                    <input
                      type="file"
                      accept="image/*"
                      id={`carousel-${index}`}
                      onChange={(e) => handleCarouselImageUpload(index, e)}
                      style={styles.fileInput}
                    />
                    {slide.url ? (
                      <img src={slide.url} alt={`Slide ${index + 1}`} style={styles.slidePreview} />
                    ) : (
                      <label htmlFor={`carousel-${index}`} style={styles.uploadPlaceholder}>
                        📷 Clique para adicionar imagem (16:9)
                      </label>
                    )}
                  </div>

                  {/* Título e Subtítulo */}
                  <div style={styles.slideFields}>
                    <input
                      type="text"
                      placeholder="Título (opcional)"
                      value={slide.title}
                      onChange={(e) => {
                        const newImages = [...carouselImages]
                        newImages[index].title = e.target.value
                        setCarouselImages(newImages)
                      }}
                      style={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Subtítulo (opcional)"
                      value={slide.subtitle}
                      onChange={(e) => {
                        const newImages = [...carouselImages]
                        newImages[index].subtitle = e.target.value
                        setCarouselImages(newImages)
                      }}
                      style={styles.input}
                    />
                  </div>

                  {/* Botão Remover */}
                  {carouselImages.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeSlideButton}
                      onClick={() => removeCarouselSlide(index)}
                    >
                      🗑️ Remover
                    </button>
                  )}

                  {/* Ícone Drag */}
                  <div style={styles.dragHandle}>⋮⋮</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              style={styles.addSlideButton}
              onClick={addCarouselSlide}
            >
              ➕ Adicionar Novo Slide
            </button>
          </div>
        )

      case 'aparencia':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Aparência</h2>

            {/* Cor de Fundo */}
            <div style={styles.field}>
              <label style={styles.label}>Cor de Fundo</label>
              <div style={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={{ ...styles.colorPreview, backgroundColor }} />
            </div>

            {/* Cor Primária (Botões) */}
            <div style={styles.field}>
              <label style={styles.label}>Cor Primária (Botões)</label>
              <div style={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={{ ...styles.colorPreview, backgroundColor: primaryColor }} />
            </div>

            {/* Cor do Texto Principal */}
            <div style={styles.field}>
              <label style={styles.label}>Cor do Texto Principal</label>
              <div style={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={{ ...styles.colorPreview, backgroundColor: textColor }} />
            </div>

            {/* Cor do Texto Secundário */}
            <div style={styles.field}>
              <label style={styles.label}>Cor do Texto Secundário</label>
              <div style={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={secondaryTextColor}
                  onChange={(e) => setSecondaryTextColor(e.target.value)}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  value={secondaryTextColor}
                  onChange={(e) => setSecondaryTextColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={{ ...styles.colorPreview, backgroundColor: secondaryTextColor }} />
            </div>

            {/* Preview */}
            <div style={styles.previewSection}>
              <h3 style={styles.previewTitle}>Preview:</h3>
              <div style={{ ...styles.screenPreview, backgroundColor }}>
                {logoPreview && (
                  <img src={logoPreview} alt="Logo" style={styles.mockLogoImage} />
                )}
                <h1 style={{ ...styles.mockStoreName, color: textColor }}>{storeName}</h1>
                <p style={{ ...styles.mockTagline, color: secondaryTextColor}}>Hambúrgueres artesanais</p>
                <button style={{ ...styles.mockButton, backgroundColor: primaryColor }}>
                  {buttonText}
                </button>
              </div>
            </div>
          </div>
        )

      case 'formas-pagamento':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Formas de Pagamento</h2>
            <p style={styles.description}>
              Ative ou desative as formas de pagamento disponíveis no totem.
            </p>

            <div style={styles.paymentList}>
              {paymentMethods.map((method) => (
                <div key={method.id} style={styles.paymentItem}>
                  <div style={styles.paymentInfo}>
                    <span style={styles.paymentIcon}>{method.icon}</span>
                    <span style={styles.paymentName}>{method.name}</span>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={() => {
                        setPaymentMethods(
                          paymentMethods.map((m) =>
                            m.id === method.id ? { ...m, enabled: !m.enabled } : m
                          )
                        )
                      }}
                      style={styles.switchInput}
                    />
                    <span style={{
                      ...styles.slider,
                      backgroundColor: method.enabled ? '#10B981' : '#D1D5DB',
                    }} />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'estatisticas':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Estatísticas e Relatórios</h2>

            {/* Cards de Estatísticas */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statIcon}>📊</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Pedidos Hoje</p>
                  <p style={styles.statValue}>{stats.pedidosHoje}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💰</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Faturamento Hoje</p>
                  <p style={styles.statValue}>R$ {stats.totalHoje.toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Pedidos Esta Semana</p>
                  <p style={styles.statValue}>{stats.pedidosSemana}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💵</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Faturamento Semana</p>
                  <p style={styles.statValue}>R$ {stats.totalSemana.toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📆</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Pedidos Este Mês</p>
                  <p style={styles.statValue}>{stats.pedidosMes}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💸</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Faturamento Mês</p>
                  <p style={styles.statValue}>R$ {stats.totalMes.toFixed(2)}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>🍔</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Mais Vendido</p>
                  <p style={styles.statValue}>{stats.produtoMaisVendido}</p>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>🎯</div>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>Ticket Médio</p>
                  <p style={styles.statValue}>R$ {stats.ticketMedio.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Histórico de Pedidos */}
            <div style={styles.historySection}>
              <h3 style={styles.historyTitle}>Últimos Pedidos</h3>
              <div style={styles.comingSoon}>
                <span style={styles.comingSoonIcon}>🚧</span>
                <p style={styles.comingSoonText}>
                  Histórico detalhado de pedidos em desenvolvimento
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>⚙️ Painel Administrativo</h1>
          <p style={styles.headerSubtitle}>Configure seu sistema</p>
        </div>
        <button style={styles.closeButton} onClick={onClose}>
          ✕ Fechar
        </button>
      </div>

      {/* Layout */}
      <div style={styles.mainLayout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tabButton,
                backgroundColor: activeTab === tab.id ? '#E11D48' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#374151',
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div style={styles.content}>
          {renderContent()}

          {/* Botões de Ação */}
          {(activeTab === 'geral' || activeTab === 'aparencia' || activeTab === 'formas-pagamento') && (
            <div style={styles.actions}>
              <button style={styles.saveButton} onClick={handleSave}>
                💾 Salvar Alterações
              </button>
            </div>
          )}

          {activeTab === 'carrossel' && (
            <div style={styles.actions}>
              <button style={styles.saveButton} onClick={() => alert('✅ Carrossel salvo!')}>
                💾 Salvar Carrossel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Estilos continuam no próximo bloco devido ao tamanho...

// CONTINUAÇÃO DO AdminScreen.tsx - ESTILOS

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },

  headerTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
    color: '#111827',
  },

  headerSubtitle: {
    fontSize: '1rem',
    color: '#6B7280',
    margin: 0,
  },

  closeButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  mainLayout: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },

  sidebar: {
    width: '280px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflowY: 'auto',
  },

  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 500,
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 150ms ease-in-out',
  },

  tabIcon: {
    fontSize: '1.25rem',
  },

  content: {
    flex: 1,
    padding: '2rem',
    overflowY: 'auto',
  },

  tabContent: {
    maxWidth: '900px',
  },

  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    color: '#111827',
  },

  description: {
    fontSize: '1rem',
    color: '#6B7280',
    marginBottom: '2rem',
  },

  field: {
    marginBottom: '2rem',
  },

  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '0.5rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #D1D5DB',
    borderRadius: '0.5rem',
  },

  hint: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.5rem',
  },

  // Upload de arquivos
  uploadArea: {
    marginBottom: '1rem',
  },

  fileInput: {
    display: 'none',
  },

  uploadButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#E11D48',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginBottom: '0.5rem',
  },

  imagePreviewBox: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },

  previewLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#6B7280',
  },

  logoPreviewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    border: '2px solid #E5E7EB',
    borderRadius: '0.5rem',
  },

  removeImageButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  // Carrossel
  carouselList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },

  carouselItem: {
    position: 'relative',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    cursor: 'move',
    transition: 'all 150ms ease-in-out',
  },

  slideNumber: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    width: '32px',
    height: '32px',
    backgroundColor: '#E11D48',
    color: '#FFFFFF',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 700,
  },

  dragHandle: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    fontSize: '1.5rem',
    color: '#9CA3AF',
    cursor: 'move',
  },

  slideImageArea: {
    width: '100%',
    height: '200px',
    marginBottom: '1rem',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  slidePreview: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  uploadPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontSize: '1rem',
    color: '#6B7280',
    cursor: 'pointer',
  },

  slideFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  removeSlideButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    backgroundColor: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  addSlideButton: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: 700,
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    width: '100%',
  },

  // Cores
  colorPickerWrapper: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },

  colorPicker: {
    width: '80px',
    height: '48px',
    border: '2px solid #D1D5DB',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  colorInput: {
    flex: 1,
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #D1D5DB',
    borderRadius: '0.5rem',
  },

  colorPreview: {
    width: '100%',
    height: '60px',
    borderRadius: '0.5rem',
    marginTop: '0.75rem',
    border: '2px solid #D1D5DB',
  },

  // Preview
  previewSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.75rem',
  },

  previewTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
  },

  screenPreview: {
    padding: '2rem',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    minHeight: '300px',
    justifyContent: 'center',
  },

  mockLogoImage: {
    maxWidth: '120px',
    maxHeight: '120px',
    objectFit: 'contain',
  },

  mockStoreName: {
    fontSize: '2rem',
    fontWeight: 700,
    margin: 0,
  },

  mockTagline: {
    fontSize: '1rem',
    margin: 0,
  },

  mockButton: {
    padding: '1rem 2rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.75rem',
  },

  // Formas de Pagamento
  paymentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  paymentItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
  },

  paymentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },

  paymentIcon: {
    fontSize: '2rem',
  },

  paymentName: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#111827',
  },

  // Switch Toggle
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '60px',
    height: '34px',
  },

  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },

  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '34px',
    transition: 'all 300ms ease-in-out',
  },

  // Estatísticas
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },

  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },

  statIcon: {
    fontSize: '3rem',
  },

  statInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },

  statLabel: {
    fontSize: '0.875rem',
    color: '#6B7280',
    margin: 0,
  },

  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },

  historySection: {
    marginTop: '2rem',
  },

  historyTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  comingSoon: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.75rem',
  },

  comingSoonIcon: {
    fontSize: '48px',
    display: 'block',
    marginBottom: '1rem',
  },

  comingSoonText: {
    fontSize: '1rem',
    color: '#6B7280',
  },

  // Ações
  actions: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E5E7EB',
  },

  saveButton: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    fontWeight: 700,
    backgroundColor: '#E11D48',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },

  // Informação de tamanho de imagem
  imageSizeInfo: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#DBEAFE',
    border: '2px solid #3B82F6',
    borderRadius: '0.75rem',
    marginBottom: '2rem',
  },

  imageSizeIcon: {
    fontSize: '3rem',
    lineHeight: 1,
  },

  imageSizeTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1E40AF',
    margin: 0,
    marginBottom: '0.5rem',
  },

  imageSizeValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1E3A8A',
    margin: 0,
    marginBottom: '0.5rem',
  },

  imageSizeHint: {
    fontSize: '0.875rem',
    color: '#1E40AF',
    margin: 0,
  },

export default AdminScreen
