// src/screens/PaymentScreen.tsx

import React, { useState } from 'react'
import { theme } from '../theme/theme'

export type PaymentMethod = 
  | 'debit' 
  | 'credit' 
  | 'pix' 
  | 'cash' 
  | 'meal-voucher'   // Vale Alimentação
  | 'food-voucher'   // Vale Refeição

export type MealVoucherBrand = 'pluxee' | 'ticket' | 'vr' | 'alelo' | 'greencard'
export type FoodVoucherBrand = 'pluxee' | 'ticket' | 'vr' | 'alelo' | 'greencard'

interface PaymentScreenProps {
  onBack: () => void
  onSuccess: (orderId: string) => void
  orderTotal: number
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSuccess, orderTotal }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [showVoucherModal, setShowVoucherModal] = useState(false)
  const [voucherType, setVoucherType] = useState<'meal' | 'food' | null>(null)
  const [selectedVoucherBrand, setSelectedVoucherBrand] = useState<string | null>(null)

  const handleSelectMethod = (method: PaymentMethod) => {
    if (method === 'meal-voucher' || method === 'food-voucher') {
      setVoucherType(method === 'meal-voucher' ? 'meal' : 'food')
      setShowVoucherModal(true)
    } else {
      setSelectedMethod(method)
    }
  }

  const handleSelectVoucherBrand = (brand: string) => {
    setSelectedVoucherBrand(brand)
    setShowVoucherModal(false)
    setSelectedMethod(voucherType === 'meal' ? 'meal-voucher' : 'food-voucher')
  }

  const handleConfirmPayment = () => {
    // Aqui você faria a integração com a Brendi
    // Por enquanto, simula sucesso
    const mockOrderId = `ORD-${Date.now()}`
    onSuccess(mockOrderId)
  }

  const paymentMethods = [
    { id: 'debit' as PaymentMethod, icon: '💳', title: 'Débito', subtitle: 'Cartão de débito' },
    { id: 'credit' as PaymentMethod, icon: '💳', title: 'Crédito', subtitle: 'Cartão de crédito' },
    { id: 'pix' as PaymentMethod, icon: '📱', title: 'PIX', subtitle: 'QR Code instantâneo' },
    { id: 'cash' as PaymentMethod, icon: '💵', title: 'Dinheiro', subtitle: 'Precisa de troco?' },
    { id: 'meal-voucher' as PaymentMethod, icon: '🍱', title: 'Vale Alimentação', subtitle: 'Pluxee, Ticket, VR...' },
    { id: 'food-voucher' as PaymentMethod, icon: '🍽️', title: 'Vale Refeição', subtitle: 'Pluxee, Ticket, VR...' },
  ]

  const voucherBrands = [
    { id: 'pluxee', name: 'Pluxee', icon: '🟣' },
    { id: 'ticket', name: 'Ticket', icon: '🟠' },
    { id: 'vr', name: 'VR', icon: '🔵' },
    { id: 'alelo', name: 'Alelo', icon: '🟢' },
    { id: 'greencard', name: 'Green Card', icon: '🟢' },
  ]

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Voltar
        </button>
        <h1 style={styles.headerTitle}>Pagamento</h1>
      </div>

      {/* Conteúdo */}
      <div style={styles.content}>
        <h2 style={styles.title}>Escolha a forma de pagamento</h2>
        
        {/* Total do pedido */}
        <div style={styles.totalBox}>
          <span style={styles.totalLabel}>Total do pedido:</span>
          <span style={styles.totalValue}>
            R$ {orderTotal.toFixed(2).replace('.', ',')}
          </span>
        </div>

        {/* Grid de métodos de pagamento */}
        <div style={styles.paymentGrid}>
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              style={{
                ...styles.paymentButton,
                borderColor: selectedMethod === method.id
                  ? theme.colors.primary.main
                  : theme.colors.neutral.gray[300],
                backgroundColor: selectedMethod === method.id
                  ? `${theme.colors.primary.main}15`
                  : theme.colors.background.paper,
              }}
              onClick={() => handleSelectMethod(method.id)}
            >
              <div style={styles.paymentIcon}>{method.icon}</div>
              <h3 style={styles.paymentTitle}>{method.title}</h3>
              <p style={styles.paymentSubtitle}>{method.subtitle}</p>
              
              {selectedMethod === method.id && (
                <div style={styles.checkmark}>✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Botão confirmar */}
        {selectedMethod && (
          <button
            style={styles.confirmButton}
            onClick={handleConfirmPayment}
          >
            CONFIRMAR PAGAMENTO
          </button>
        )}
      </div>

      {/* Modal de escolha de bandeira de vale */}
      {showVoucherModal && (
        <div style={styles.modalOverlay} onClick={() => setShowVoucherModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>
              Escolha a bandeira do {voucherType === 'meal' ? 'Vale Alimentação' : 'Vale Refeição'}
            </h2>
            
            <div style={styles.voucherGrid}>
              {voucherBrands.map((brand) => (
                <button
                  key={brand.id}
                  style={styles.voucherButton}
                  onClick={() => handleSelectVoucherBrand(brand.id)}
                >
                  <div style={styles.voucherIcon}>{brand.icon}</div>
                  <span style={styles.voucherName}>{brand.name}</span>
                </button>
              ))}
            </div>

            <button
              style={styles.modalCloseButton}
              onClick={() => setShowVoucherModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: theme.colors.background.default,
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.lg,
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.paper,
    boxShadow: theme.shadows.sm,
  },

  backButton: {
    padding: `${theme.spacing.md} ${theme.spacing.lg}`,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: theme.colors.neutral.gray[100],
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
  },

  headerTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    margin: 0,
  },

  content: {
    flex: 1,
    padding: theme.spacing['2xl'],
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },

  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  totalBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing['2xl'],
    boxShadow: theme.shadows.md,
  },

  totalLabel: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral.gray[600],
  },

  totalValue: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.primary.main,
  },

  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing['2xl'],
  },

  paymentButton: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.xl,
    minHeight: '180px',
    border: '3px solid',
    borderRadius: theme.borderRadius.xl,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    boxShadow: theme.shadows.sm,
  },

  paymentIcon: {
    fontSize: '64px',
    lineHeight: 1,
  },

  paymentTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    margin: 0,
  },

  paymentSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral.gray[600],
    margin: 0,
    textAlign: 'center',
  },

  checkmark: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: '32px',
    height: '32px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.neutral.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },

  confirmButton: {
    width: '100%',
    maxWidth: '500px',
    margin: '0 auto',
    display: 'block',
    padding: `${theme.spacing.xl} ${theme.spacing['2xl']}`,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.neutral.white,
    border: 'none',
    borderRadius: theme.borderRadius.lg,
    cursor: 'pointer',
    boxShadow: theme.shadows.xl,
    transition: `all ${theme.transitions.fast}`,
  },

  // Modal de vales
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: theme.spacing.xl,
  },

  modal: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing['2xl'],
    maxWidth: '600px',
    width: '100%',
    boxShadow: theme.shadows['2xl'],
  },

  modalTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  voucherGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },

  voucherButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.sm,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.default,
    border: `2px solid ${theme.colors.neutral.gray[300]}`,
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
  },

  voucherIcon: {
    fontSize: '48px',
  },

  voucherName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  modalCloseButton: {
    width: '100%',
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: theme.colors.neutral.gray[200],
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
  },
}

export default PaymentScreen
