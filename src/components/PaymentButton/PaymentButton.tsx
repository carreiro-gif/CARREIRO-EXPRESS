// src/components/PaymentButton/PaymentButton.tsx

import React from 'react'
import { theme } from '../../theme/theme'

export type PaymentMethod = 'card' | 'pix' | 'cash'

interface PaymentButtonProps {
  method: PaymentMethod
  selected: boolean
  onSelect: (method: PaymentMethod) => void
  disabled?: boolean
}

const paymentConfig = {
  card: {
    icon: '💳',
    title: 'Cartão',
    subtitle: 'Débito ou Crédito',
    color: '#3B82F6', // Azul
  },
  pix: {
    icon: '📱',
    title: 'PIX',
    subtitle: 'QR Code instantâneo',
    color: '#10B981', // Verde
  },
  cash: {
    icon: '💵',
    title: 'Dinheiro',
    subtitle: 'Levar troco?',
    color: '#F59E0B', // Laranja
  },
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  method,
  selected,
  onSelect,
  disabled = false,
}) => {
  const config = paymentConfig[method]
  const [isPressed, setIsPressed] = React.useState(false)

  return (
    <button
      style={{
        ...styles.button,
        borderColor: selected ? config.color : theme.colors.neutral.gray[300],
        backgroundColor: selected
          ? `${config.color}15` // 15 = ~8% opacity
          : theme.colors.background.paper,
        transform: isPressed ? 'scale(0.97)' : 'scale(1)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={() => !disabled && onSelect(method)}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => !disabled && setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      disabled={disabled}
    >
      {/* Ícone */}
      <div style={styles.iconWrapper}>
        <span style={styles.icon}>{config.icon}</span>
      </div>

      {/* Conteúdo */}
      <div style={styles.content}>
        <h3 style={styles.title}>{config.title}</h3>
        <p style={styles.subtitle}>{config.subtitle}</p>
      </div>

      {/* Indicador de seleção */}
      {selected && (
        <div
          style={{
            ...styles.checkmark,
            backgroundColor: config.color,
          }}
        >
          ✓
        </div>
      )}
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    width: '100%',
    minHeight: '180px',
    padding: theme.spacing.xl,
    border: '3px solid',
    borderRadius: theme.borderRadius.xl,
    transition: `all ${theme.transitions.fast}`,
    userSelect: 'none',
  },

  iconWrapper: {
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral.gray[100],
    borderRadius: theme.borderRadius.full,
  },

  icon: {
    fontSize: '48px',
    lineHeight: 1,
  },

  content: {
    textAlign: 'center',
  },

  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.gray[900],
    margin: 0,
    marginBottom: theme.spacing.xs,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral.gray[600],
    margin: 0,
  },

  checkmark: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: '32px',
    height: '32px',
    borderRadius: theme.borderRadius.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.neutral.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
}

// =============================================================================
// GRID DE BOTÕES DE PAGAMENTO
// =============================================================================

interface PaymentMethodsGridProps {
  selectedMethod: PaymentMethod | null
  onSelectMethod: (method: PaymentMethod) => void
  disabledMethods?: PaymentMethod[]
}

export const PaymentMethodsGrid: React.FC<PaymentMethodsGridProps> = ({
  selectedMethod,
  onSelectMethod,
  disabledMethods = [],
}) => {
  const methods: PaymentMethod[] = ['card', 'pix', 'cash']

  return (
    <div style={gridStyles.container}>
      <h2 style={gridStyles.title}>Escolha a forma de pagamento</h2>
      
      <div style={gridStyles.grid}>
        {methods.map((method) => (
          <PaymentButton
            key={method}
            method={method}
            selected={selectedMethod === method}
            onSelect={onSelectMethod}
            disabled={disabledMethods.includes(method)}
          />
        ))}
      </div>
    </div>
  )
}

const gridStyles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    padding: theme.spacing['2xl'],
  },

  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.gray[900],
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    maxWidth: '1000px',
    margin: '0 auto',
  },
}
