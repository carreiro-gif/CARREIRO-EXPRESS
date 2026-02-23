// src/screens/AdminScreen.tsx
// Painel Admin COM ABA CARDÁPIO

import React, { useState } from 'react'
import { useConfig } from '../context/ConfigContext'
import ProductManagementScreen from './ProductManagementScreen'

type AdminTab = 'geral' | 'carrossel' | 'aparencia' | 'pagamento' | 'estatisticas' | 'cardapio'

interface AdminScreenProps {
  onClose: () => void
}

const AdminScreen: React.FC<AdminScreenProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('geral')
  const { config, updateConfig } = useConfig()

  const tabs = [
    { id: 'geral' as AdminTab, label: 'Geral', icon: '⚙️' },
    { id: 'carrossel' as AdminTab, label: 'Carrossel', icon: '🎬' },
    { id: 'aparencia' as AdminTab, label: 'Aparência', icon: '🎨' },
    { id: 'pagamento' as AdminTab, label: 'Pagamento', icon: '💳' },
    { id: 'estatisticas' as AdminTab, label: 'Estatísticas', icon: '📊' },
    { id: 'cardapio' as AdminTab, label: 'Cardápio', icon: '🗂️' }, // ⭐ NOVO
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
            <p style={styles.description}>
              Configure as imagens que aparecem na tela inicial
            </p>
            
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
                  placeholder="https://exemplo.com/imagem1.jpg
https://exemplo.com/imagem2.jpg"
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
        // ⭐ NOVO - Tela de gerenciamento de cardápio
        return <ProductManagementScreen />

      default:
        return null
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>⚙️ Painel Admin</h1>
          <button onClick={onClose} style={styles.closeButton}>
            ✕ Fechar
          </button>
        </div>

        <div style={styles.container}>
          {/* Sidebar */}
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

          {/* Content */}
          <div style={styles.content}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
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
    marginBottom: '0.5rem',
  },

  description: {
    fontSize: '0.95rem',
    color: '#6B7280',
    marginBottom: '2rem',
  },

  formGroup: {
    marginBottom: '1.5rem',
  },

  label: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#374151',
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
}

export default AdminScreen
