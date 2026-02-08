// src/screens/AdminScreen.tsx - VERSÃO CORRIGIDA

import React, { useState, useRef } from 'react'
import { theme } from '../theme/theme'
import { useConfig } from '../context/ConfigContext'
import { useOrder } from '../context/OrderContext'

interface AdminScreenProps {
  onClose: () => void
}

type AdminTab = 
  | 'geral' 
  | 'carrossel' 
  | 'aparencia' 
  | 'formas-pagamento'
  | 'estatisticas'

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const { stats } = useOrder()
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')

  // Estados para Geral
  const [storeName, setStoreName] = useState(config.storeName)
  const [buttonText, setButtonText] = useState(config.buttonText)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(config.logoUrl || '')
  const logoInputRef = useRef<HTMLInputElement>(null)

  // Estados para Carrossel
  const [carouselImages, setCarouselImages] = useState(
    config.carouselSlides && config.carouselSlides.length > 0
      ? config.carouselSlides.map((slide, index) => ({
          id: slide.id || `slide-${index}`,
          file: null,
          url: slide.imageUrl,
          title: slide.title || '',
          subtitle: slide.subtitle || '',
        }))
      : [{ id: '1', file: null, url: '', title: '', subtitle: '' }]
  )
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  // Estados para Aparência
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor)
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor)
  const [textColor, setTextColor] = useState(config.textColor || '#111827')
  const [secondaryTextColor, setSecondaryTextColor] = useState(config.secondaryTextColor || '#6B7280')
  const [buttonTextColor, setButtonTextColor] = useState(config.buttonTextColor || '#FFFFFF')

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
    if (carouselImages.length > 1) {
      setCarouselImages(carouselImages.filter((_, i) => i !== index))
    }
  }

  // ========== DRAG & DROP ==========

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

  const handleSaveGeral = () => {
    updateConfig({
      storeName,
      buttonText,
      logoUrl: logoPreview || null,
    })
    alert('✅ Configurações gerais salvas!')
  }

  const handleSaveCarousel = () => {
    // Salvar carrossel no config
    const slidesToSave = carouselImages
      .filter(img => img.url) // Só salvar slides com imagem
      .map(img => ({
        id: img.id,
        imageUrl: img.url,
        title: img.title,
        subtitle: img.subtitle,
      }))

    updateConfig({
      carouselSlides: slidesToSave,
    })
    
    alert(`✅ Carrossel salvo! ${slidesToSave.length} slides salvos.`)
  }

  const handleSaveAppearance = () => {
    updateConfig({
      backgroundColor,
      primaryColor,
      textColor,
      secondaryTextColor,
      buttonTextColor,
    })
    alert('✅ Cores salvas!')
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

            <div style={styles.field}>
              <label style={styles.label}>Nome da Loja</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Texto do Botão Principal</label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Logo da Loja (JPG ou PNG)</label>
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
                📁 Escolher Imagem
              </button>
              
              {logoPreview && (
                <div style={styles.imagePreviewBox}>
                  <img src={logoPreview} alt="Logo" style={styles.logoPreviewImage} />
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

            <button style={styles.saveButton} onClick={handleSaveGeral}>
              💾 Salvar Configurações Gerais
            </button>
          </div>
        )

      case 'carrossel':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Gerenciar Carrossel</h2>

            {/* Alerta de Tamanho */}
            <div style={styles.imageSizeInfo}>
              <span style={styles.imageSizeIcon}>📐</span>
              <div>
                <p style={styles.imageSizeTitle}>Tamanho para Monitor Vertical (em pé):</p>
                <p style={styles.imageSizeValue}>✅ 1080 x 1920 pixels (9:16)</p>
              </div>
            </div>

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
                  <div style={styles.slideNumber}>#{index + 1}</div>

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
                        📷 Clique para adicionar (1080x1920)
                      </label>
                    )}
                  </div>

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

                  {carouselImages.length > 1 && (
                    <button
                      type="button"
                      style={styles.removeSlideButton}
                      onClick={() => removeCarouselSlide(index)}
                    >
                      🗑️ Remover
                    </button>
                  )}

                  <div style={styles.dragHandle}>⋮⋮</div>
                </div>
              ))}
            </div>

            <button style={styles.addSlideButton} onClick={addCarouselSlide}>
              ➕ Adicionar Slide
            </button>

            <button style={styles.saveButton} onClick={handleSaveCarousel}>
              💾 Salvar Carrossel
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

            {/* Cor Primária */}
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

            {/* COR DO TEXTO DO BOTÃO - NOVO! */}
            <div style={styles.field}>
              <label style={styles.label}>Cor do Texto do Botão ⭐ NOVO!</label>
              <div style={styles.colorPickerWrapper}>
                <input
                  type="color"
                  value={buttonTextColor}
                  onChange={(e) => setButtonTextColor(e.target.value)}
                  style={styles.colorPicker}
                />
                <input
                  type="text"
                  value={buttonTextColor}
                  onChange={(e) => setButtonTextColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
              <div style={{ ...styles.colorPreview, backgroundColor: buttonTextColor }} />
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
                <p style={{ ...styles.mockTagline, color: secondaryTextColor }}>Hambúrgueres artesanais</p>
                <button style={{ 
                  ...styles.mockButton, 
                  backgroundColor: primaryColor,
                  color: buttonTextColor,
                }}>
                  {buttonText}
                </button>
              </div>
            </div>

            <button style={styles.saveButton} onClick={handleSaveAppearance}>
              💾 Salvar Aparência
            </button>
          </div>
        )

      case 'formas-pagamento':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Formas de Pagamento</h2>
            <div style={styles.comingSoon}>
              <p>🚧 Em desenvolvimento</p>
            </div>
          </div>
        )

      case 'estatisticas':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Estatísticas em Tempo Real</h2>

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
                  <p style={styles.statLabel}>Pedidos Semana</p>
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
                  <p style={styles.statLabel}>Pedidos Mês</p>
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
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>⚙️ Painel Administrativo</h1>
        </div>
        <button style={styles.closeButton} onClick={onClose}>
          ✕ Fechar
        </button>
      </div>

      <div style={styles.mainLayout}>
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

        <div style={styles.content}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

// CONTINUA NO PRÓXIMO ARQUIVO COM OS ESTILOS...
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
  },

  headerTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
  },

  closeButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  mainLayout: {
    display: 'flex',
    flex: 1,
  },

  sidebar: {
    width: '280px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E5E7EB',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
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
  },

  field: {
    marginBottom: '2rem',
  },

  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '1rem',
    border: '2px solid #D1D5DB',
    borderRadius: '0.5rem',
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

  logoPreviewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
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
  },

  imageSizeTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1E40AF',
    margin: 0,
  },

  imageSizeValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#1E3A8A',
    margin: 0,
  },

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
    marginBottom: '1rem',
  },

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
    border: 'none',
    borderRadius: '0.75rem',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },

  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: '#FFFFFF',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
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
    margin: 0,
  },

  comingSoon: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.75rem',
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
    marginTop: '1rem',
  },
}

export default AdminScreen
