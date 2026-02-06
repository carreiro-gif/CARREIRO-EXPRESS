// src/screens/OrderTypeScreen.tsx

import React, { useState } from 'react'
import { theme } from '../theme/theme'

export type OrderType = 'dine-in' | 'takeout'

interface OrderTypeScreenProps {
  onSelectType: (type: OrderType) => void
  onBack: () => void
}

const OrderTypeScreen: React.FC<OrderTypeScreenProps> = ({ onSelectType, onBack }) => {
  const [selected, setSelected] = useState<OrderType | null>(null)

  const handleSelect = (type: OrderType) => {
    setSelected(type)
    setTimeout(() => {
      onSelectType(type)
    }, 300)
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Voltar
        </button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Como você vai consumir?</h1>
        <p style={styles.subtitle}>Escolha uma opção para continuar</p>

        <div style={styles.optionsGrid}>
          <button
            style={{
              ...styles.optionButton,
              backgroundColor: selected === 'takeout'
                ? '#E11D48'
                : '#FFFFFF',
              transform: selected === 'takeout' ? 'scale(0.98)' : 'scale(1)',
            }}
            onClick={() => handleSelect('takeout')}
          >
            <div style={styles.optionIcon}>🥡</div>
            <h2 style={{
              ...styles.optionTitle,
              color: selected === 'takeout' ? '#FFFFFF' : '#111827',
            }}>
              Para Viagem
            </h2>
            <p style={{
              ...styles.optionDescription,
              color: selected === 'takeout' ? '#FFFFFF' : '#6B7280',
            }}>
              Levar para consumir em outro local
            </p>
          </button>

          <button
            style={{
              ...styles.optionButton,
              backgroundColor: selected === 'dine-in'
                ? '#E11D48'
                : '#FFFFFF',
              transform: selected === 'dine-in' ? 'scale(0.98)' : 'scale(1)',
            }}
            onClick={() => handleSelect('dine-in')}
          >
            <div style={styles.optionIcon}>🍽️</div>
            <h2 style={{
              ...styles.optionTitle,
              color: selected === 'dine-in' ? '#FFFFFF' : '#111827',
            }}>
              Comer Aqui
            </h2>
            <p style={{
              ...styles.optionDescription,
              color: selected === 'dine-in' ? '#FFFFFF' : '#6B7280',
            }}>
              Consumir no local
            </p>
          </button>
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
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  },

  backButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    gap: '2rem',
  },

  title: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: '#111827',
    textAlign: 'center',
    margin: 0,
  },

  subtitle: {
    fontSize: '1.25rem',
    color: '#6B7280',
    textAlign: 'center',
    margin: 0,
  },

  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '3rem',
    width: '100%',
    maxWidth: '800px',
    marginTop: '2rem',
  },

  optionButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    padding: '3rem',
    minHeight: '320px',
    border: '3px solid #E5E7EB',
    borderRadius: '1rem',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },

  optionIcon: {
    fontSize: '96px',
    lineHeight: 1,
  },

  optionTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
  },

  optionDescription: {
    fontSize: '1.125rem',
    textAlign: 'center',
    margin: 0,
  },
}

export default OrderTypeScreen
