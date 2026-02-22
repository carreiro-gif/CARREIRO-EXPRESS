// src/screens/OrderTypeScreen.tsx
// Tela de seleção do tipo de pedido

import React from 'react'
import { useOrder } from '../context/OrderContext'

interface OrderTypeScreenProps {
  onSelect: (type: 'dine-in' | 'takeaway') => void
  onBack: () => void
}

const OrderTypeScreen: React.FC<OrderTypeScreenProps> = ({ onSelect, onBack }) => {
  const { setOrderType } = useOrder()

  const handleSelect = (type: 'dine-in' | 'takeaway') => {
    setOrderType(type)
    onSelect(type)
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Voltar
        </button>
        <h1 style={styles.title}>Como você vai comer?</h1>
      </div>

      {/* Options */}
      <div style={styles.options}>
        {/* Para Viagem */}
        <button
          onClick={() => handleSelect('takeaway')}
          style={styles.optionButton}
        >
          <div style={styles.optionIcon}>🛍️</div>
          <div style={styles.optionTitle}>Para Viagem</div>
          <div style={styles.optionDescription}>
            Retire seu pedido e leve para onde quiser
          </div>
        </button>

        {/* Comer Aqui */}
        <button
          onClick={() => handleSelect('dine-in')}
          style={styles.optionButton}
        >
          <div style={styles.optionIcon}>🍽️</div>
          <div style={styles.optionTitle}>Comer Aqui</div>
          <div style={styles.optionDescription}>
            Aproveite seu lanche no nosso espaço
          </div>
        </button>
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
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#FFF',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },

  backButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
    color: '#111827',
  },

  options: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },

  optionButton: {
    flex: 1,
    maxWidth: '400px',
    padding: '3rem 2rem',
    backgroundColor: '#FFF',
    border: '3px solid #E5E7EB',
    borderRadius: '1.5rem',
    cursor: 'pointer',
    transition: 'all 200ms',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },

  optionIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
  },

  optionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '0.75rem',
  },

  optionDescription: {
    fontSize: '1.125rem',
    color: '#6B7280',
    lineHeight: 1.5,
  },
}

// Adicionar hover effect via CSS-in-JS inline
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    [style*="optionButton"]:hover {
      border-color: #E11D48 !important;
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(225, 29, 72, 0.2) !important;
    }
    [style*="backButton"]:hover {
      background-color: #E5E7EB !important;
    }
  `
  document.head.appendChild(style)
}

export default OrderTypeScreen
