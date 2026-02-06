// src/screens/AdminScreen.tsx

import React, { useState } from 'react'
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

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const { config, updateConfig } = useConfig()
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')

  // Estados locais para edição
  const [storeName, setStoreName] = useState(config.storeName)
  const [buttonText, setButtonText] = useState(config.buttonText)
  const [backgroundColor, setBackgroundColor] = useState(config.backgroundColor)
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor)
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || '')

  // Salvar configurações
  const handleSave = () => {
    updateConfig({
      storeName,
      buttonText,
      backgroundColor,
      primaryColor,
      logoUrl: logoUrl || null,
    })
    alert('✅ Configurações salvas com sucesso!')
  }

  const tabs = [
    { id: 'geral' as AdminTab, label: 'Geral', icon: '⚙️' },
    { id: 'carrossel' as AdminTab, label: 'Carrossel', icon: '🎬' },
    { id: 'aparencia' as AdminTab, label: 'Aparência', icon: '🎨' },
    { id: 'formas-pagamento' as AdminTab, label: 'Pagamentos', icon: '💳' },
  ]

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

            {/* URL da Logo */}
            <div style={styles.field}>
              <label style={styles.label}>Logo (URL da Imagem)</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                style={styles.input}
                placeholder="https://exemplo.com/logo.png"
              />
              <p style={styles.hint}>
                💡 Cole a URL de uma imagem hospedada online
              </p>
              {logoUrl && (
                <div style={styles.preview}>
                  <p style={styles.previewLabel}>Preview:</p>
                  <img 
                    src={logoUrl} 
                    alt="Logo preview" 
                    style={styles.previewImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
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
              Configure as imagens que aparecem no carrossel da tela inicial.
            </p>

            <div style={styles.comingSoon}>
              <span style={styles.comingSoonIcon}>🚧</span>
              <h3 style={styles.comingSoonTitle}>Em Desenvolvimento</h3>
              <p style={styles.comingSoonText}>
                Esta funcionalidade estará disponível em breve.
                <br />
                Por enquanto, o carrossel usa imagens padrão.
              </p>
            </div>
          </div>
        )

      case 'aparencia':
        return (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Aparência</h2>

            {/* Cor de Fundo */}
            <div style={styles.field}>
              <label style={styles.label}>Cor de Fundo da Tela Inicial</label>
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
                  placeholder="#F9FAFB"
                />
              </div>
              <div 
                style={{
                  ...styles.colorPreview,
                  backgroundColor: backgroundColor,
                }}
              />
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
                  placeholder="#E11D48"
                />
              </div>
              <div 
                style={{
                  ...styles.colorPreview,
                  backgroundColor: primaryColor,
                }}
              />
            </div>

            {/* Preview da Tela */}
            <div style={styles.previewSection}>
              <h3 style={styles.previewTitle}>Preview da Tela Inicial:</h3>
              <div 
                style={{
                  ...styles.screenPreview,
                  backgroundColor: backgroundColor,
                }}
              >
                <div style={styles.mockLogo}>
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" style={styles.mockLogoImage} />
                  ) : (
                    <div style={styles.mockLogoPlaceholder}>LOGO</div>
                  )}
                </div>
                <h1 style={styles.mockStoreName}>{storeName}</h1>
                <button 
                  style={{
                    ...styles.mockButton,
                    backgroundColor: primaryColor,
                  }}
                >
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
              Configure quais formas de pagamento estão disponíveis no totem.
            </p>

            <div style={styles.comingSoon}>
              <span style={styles.comingSoonIcon}>🚧</span>
              <h3 style={styles.comingSoonTitle}>Em Desenvolvimento</h3>
              <p style={styles.comingSoonText}>
                Esta funcionalidade estará disponível em breve.
                <br />
                Por enquanto, todas as formas de pagamento estão ativas.
              </p>
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
        <div style={styles.headerLeft}>
          <h1 style={styles.headerTitle}>⚙️ Painel Administrativo</h1>
          <p style={styles.headerSubtitle}>Configure seu sistema de autoatendimento</p>
        </div>
        <button style={styles.closeButton} onClick={onClose}>
          ✕ Fechar
        </button>
      </div>

      {/* Layout Principal */}
      <div style={styles.mainLayout}>
        {/* Sidebar com Tabs */}
        <div style={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tabButton,
                backgroundColor: activeTab === tab.id
                  ? '#E11D48'
                  : 'transparent',
                color: activeTab === tab.id
                  ? '#FFFFFF'
                  : '#374151',
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
          {(activeTab === 'geral' || activeTab === 'aparencia') && (
            <div style={styles.actions}>
              <button 
                style={styles.resetButton}
                onClick={() => {
                  setStoreName('CARREIRO LANCHES')
                  setButtonText('PEÇA AQUI')
                  setBackgroundColor('#F9FAFB')
                  setPrimaryColor('#E11D48')
                  setLogoUrl('')
                }}
              >
                🔄 Restaurar Padrão
              </button>
              <button style={styles.saveButton} onClick={handleSave}>
                💾 Salvar Alterações
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

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

  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
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
    transition: 'all 150ms ease-in-out',
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
    display: 'flex',
    flexDirection: 'column',
  },

  tabContent: {
    flex: 1,
    maxWidth: '800px',
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
    transition: 'all 150ms ease-in-out',
  },

  hint: {
    fontSize: '0.875rem',
    color: '#6B7280',
    marginTop: '0.25rem',
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

  preview: {
    marginTop: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.5rem',
  },

  previewLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#6B7280',
    marginBottom: '0.5rem',
  },

  previewImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
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
    gap: '1.5rem',
    minHeight: '300px',
    justifyContent: 'center',
  },

  mockLogo: {
    width: '100px',
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  mockLogoImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },

  mockLogoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#D1D5DB',
    borderRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    color: '#6B7280',
  },

  mockStoreName: {
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: 0,
  },

  mockButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
  },

  comingSoon: {
    padding: '3rem',
    textAlign: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.75rem',
  },

  comingSoonIcon: {
    fontSize: '64px',
    display: 'block',
    marginBottom: '1.5rem',
  },

  comingSoonTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.75rem',
  },

  comingSoonText: {
    fontSize: '1rem',
    color: '#6B7280',
  },

  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #E5E7EB',
  },

  resetButton: {
    padding: '1rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
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
    transition: 'all 150ms ease-in-out',
  },
}

export default AdminScreen
