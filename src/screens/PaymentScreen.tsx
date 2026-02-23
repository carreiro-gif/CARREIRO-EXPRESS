// src/screens/PaymentScreen-MODERNO.tsx
// Pagamento moderno com múltiplas formas, troco, sub-opções

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import { useSaipos } from '../hooks/useSaipos'

interface PaymentScreenProps {
  onBack: () => void
  onSuccess: (orderId: string) => void
}

type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix' | 'vale-alimentacao' | 'vale-refeicao'

interface PaymentSelection {
  method: PaymentMethod
  amount: number
  subOption?: string // Para vales
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSuccess }) => {
  const { cart, cartTotal, clearCart } = useOrder()
  const { createOrder, loading, error } = useSaipos()
  
  const [payments, setPayments] = useState<PaymentSelection[]>([])
  const [showSubOptions, setShowSubOptions] = useState<PaymentMethod | null>(null)
  const [changeFor, setChangeFor] = useState<string>('')
  const [showChangeInput, setShowChangeInput] = useState(false)

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = cartTotal - totalPaid

  // Adicionar forma de pagamento
  const addPayment = (method: PaymentMethod, subOption?: string) => {
    const amount = remaining > 0 ? remaining : cartTotal
    setPayments([...payments, { method, amount, subOption }])
    setShowSubOptions(null)
    
    if (method === 'dinheiro') {
      setShowChangeInput(true)
    }
  }

  // Remover forma de pagamento
  const removePayment = (index: number) => {
    const newPayments = payments.filter((_, i) => i !== index)
    setPayments(newPayments)
    if (!newPayments.some(p => p.method === 'dinheiro')) {
      setShowChangeInput(false)
      setChangeFor('')
    }
  }

  // Atualizar valor de uma forma
  const updatePaymentAmount = (index: number, amount: number) => {
    const newPayments = [...payments]
    newPayments[index].amount = amount
    setPayments(newPayments)
  }

  // Finalizar pedido
  const handleConfirm = async () => {
    if (remaining > 0) {
      alert('O valor pago está incompleto!')
      return
    }

    if (showChangeInput && !changeFor) {
      alert('Informe o valor do troco!')
      return
    }

    try {
      const items = cart.map(item => ({
        integration_code: item.product.integration_code,
        desc_item: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.discount_enabled 
          ? item.product.discount_price 
          : item.product.price,
        choice_items: []
      }))

      const notes = payments.map(p => 
        `${getPaymentLabel(p.method)} ${p.subOption ? `(${p.subOption})` : ''}: R$ ${p.amount.toFixed(2)}`
      ).join(', ') + (changeFor ? ` - Troco para: R$ ${changeFor}` : '')

      const result = await createOrder(items, cartTotal, notes)
      
      if (result) {
        clearCart()
        onSuccess(result.display_id)
      }
    } catch (err) {
      console.error('Erro ao finalizar:', err)
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Voltar
        </button>
        <h1 style={styles.title}>Pagamento</h1>
      </div>

      <div style={styles.content}>
        {/* Resumo do Pedido */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Resumo do Pedido</h2>
          <div style={styles.summaryItems}>
            {cart.map((item, idx) => (
              <div key={idx} style={styles.summaryItem}>
                <span>{item.quantity}x {item.product.name}</span>
                <span>R$ {(item.quantity * (item.product.discount_enabled ? item.product.discount_price : item.product.price)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Formas de Pagamento Selecionadas */}
        {payments.length > 0 && (
          <div style={styles.selectedPayments}>
            <h3 style={styles.sectionTitle}>Formas de Pagamento</h3>
            {payments.map((payment, idx) => (
              <div key={idx} style={styles.selectedPayment}>
                <div style={styles.selectedPaymentInfo}>
                  <span style={styles.selectedPaymentIcon}>
                    {getPaymentIcon(payment.method)}
                  </span>
                  <div>
                    <div style={styles.selectedPaymentName}>
                      {getPaymentLabel(payment.method)}
                      {payment.subOption && ` - ${payment.subOption}`}
                    </div>
                    <input
                      type="number"
                      value={payment.amount}
                      onChange={(e) => updatePaymentAmount(idx, parseFloat(e.target.value) || 0)}
                      style={styles.amountInput}
                      step="0.01"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removePayment(idx)}
                  style={styles.removePaymentBtn}
                >
                  ✕
                </button>
              </div>
            ))}
            
            {/* Campo de Troco */}
            {showChangeInput && (
              <div style={styles.changeInput}>
                <label style={styles.changeLabel}>Troco para quanto?</label>
                <input
                  type="number"
                  value={changeFor}
                  onChange={(e) => setChangeFor(e.target.value)}
                  placeholder="Ex: 100.00"
                  style={styles.input}
                  step="0.01"
                />
                {changeFor && (
                  <div style={styles.changeAmount}>
                    Troco: R$ {(parseFloat(changeFor) - cartTotal).toFixed(2)}
                  </div>
                )}
              </div>
            )}

            {/* Status do Pagamento */}
            <div style={styles.paymentStatus}>
              <div style={styles.statusRow}>
                <span>Total pago:</span>
                <span style={{ color: totalPaid >= cartTotal ? '#10B981' : '#E11D48' }}>
                  R$ {totalPaid.toFixed(2)}
                </span>
              </div>
              {remaining > 0 && (
                <div style={styles.statusRow}>
                  <span>Falta pagar:</span>
                  <span style={{ color: '#E11D48', fontWeight: 700 }}>
                    R$ {remaining.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Opções de Pagamento */}
        {remaining > 0 && !showSubOptions && (
          <div style={styles.paymentOptions}>
            <h3 style={styles.sectionTitle}>
              {payments.length > 0 ? 'Adicionar outra forma' : 'Escolha a forma de pagamento'}
            </h3>
            
            <div style={styles.paymentGrid}>
              {/* Dinheiro */}
              <button
                onClick={() => addPayment('dinheiro')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>💵</span>
                <span style={styles.paymentLabel}>Dinheiro</span>
              </button>

              {/* Cartão Débito */}
              <button
                onClick={() => addPayment('debito')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>💳</span>
                <span style={styles.paymentLabel}>Débito</span>
              </button>

              {/* Cartão Crédito */}
              <button
                onClick={() => addPayment('credito')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>💳</span>
                <span style={styles.paymentLabel}>Crédito</span>
              </button>

              {/* Pix */}
              <button
                onClick={() => addPayment('pix')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>
                  <svg width="40" height="40" viewBox="0 0 512 512" fill="#00d1b2">
                    <path d="M242.4 292.5C247.8 287.1 255.9 287.1 261.3 292.5L339.7 370.9C347.1 378.3 347.1 390.3 339.7 397.7L265.3 472.1C259.9 477.5 251.8 477.5 246.4 472.1L168 393.7C160.6 386.3 160.6 374.3 168 366.9L242.4 292.5zM292.5 242.4C287.1 247.8 287.1 255.9 292.5 261.3L370.9 339.7C378.3 347.1 390.3 347.1 397.7 339.7L472.1 265.3C477.5 259.9 477.5 251.8 472.1 246.4L393.7 168C386.3 160.6 374.3 160.6 366.9 168L292.5 242.4zM218.6 218.6C223.1 223.1 231.2 223.1 236.6 218.6L365.3 89.94C377.4 77.91 396.5 77.91 408.6 89.94L490.3 171.6C502.4 183.7 502.4 202.8 490.3 214.9L361.6 343.6C356.2 349 348.1 349 342.7 343.6L214 214.9C201.9 202.8 201.9 183.7 214 171.6L218.6 218.6z"/>
                  </svg>
                </span>
                <span style={styles.paymentLabel}>Pix</span>
              </button>

              {/* Vale Alimentação */}
              <button
                onClick={() => setShowSubOptions('vale-alimentacao')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>🍽️</span>
                <span style={styles.paymentLabel}>Vale Alimentação</span>
              </button>

              {/* Vale Refeição */}
              <button
                onClick={() => setShowSubOptions('vale-refeicao')}
                style={styles.paymentOption}
              >
                <span style={styles.paymentIcon}>🍽️</span>
                <span style={styles.paymentLabel}>Vale Refeição</span>
              </button>
            </div>
          </div>
        )}

        {/* Sub-opções de Vale */}
        {showSubOptions && (
          <div style={styles.subOptions}>
            <div style={styles.subOptionsHeader}>
              <h3 style={styles.sectionTitle}>
                {showSubOptions === 'vale-alimentacao' ? 'Escolha o cartão Alimentação' : 'Escolha o cartão Refeição'}
              </h3>
              <button onClick={() => setShowSubOptions(null)} style={styles.closeBtn}>
                ← Voltar
              </button>
            </div>
            
            <div style={styles.subOptionsGrid}>
              {getValeOptions(showSubOptions).map(option => (
                <button
                  key={option}
                  onClick={() => addPayment(showSubOptions, option)}
                  style={styles.subOption}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão Finalizar */}
        {totalPaid >= cartTotal && (
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{
              ...styles.confirmButton,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processando...' : `Confirmar Pedido - R$ ${cartTotal.toFixed(2)}`}
          </button>
        )}

        {error && (
          <div style={styles.error}>
            ❌ {error}
          </div>
        )}
      </div>
    </div>
  )
}

// Funções auxiliares
const getPaymentLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    'dinheiro': 'Dinheiro',
    'debito': 'Cartão Débito',
    'credito': 'Cartão Crédito',
    'pix': 'Pix',
    'vale-alimentacao': 'Vale Alimentação',
    'vale-refeicao': 'Vale Refeição'
  }
  return labels[method]
}

const getPaymentIcon = (method: PaymentMethod): string => {
  const icons: Record<PaymentMethod, string> = {
    'dinheiro': '💵',
    'debito': '💳',
    'credito': '💳',
    'pix': '🔷',
    'vale-alimentacao': '🍽️',
    'vale-refeicao': '🍽️'
  }
  return icons[method]
}

const getValeOptions = (type: PaymentMethod): string[] => {
  if (type === 'vale-alimentacao') {
    return ['Alelo Alimentação', 'Sodexo Alimentação', 'VR Alimentação', 'Ticket Alimentação']
  }
  return ['Alelo Refeição', 'Sodexo Refeição', 'VR Refeição', 'Ticket Refeição']
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
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
  },

  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    margin: 0,
  },

  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },

  summary: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  summaryTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  summaryItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #E5E7EB',
  },

  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
  },

  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#E11D48',
  },

  selectedPayments: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },

  selectedPayment: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
    marginBottom: '0.75rem',
  },

  selectedPaymentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
  },

  selectedPaymentIcon: {
    fontSize: '2rem',
  },

  selectedPaymentName: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },

  amountInput: {
    width: '150px',
    padding: '0.5rem',
    border: '2px solid #E11D48',
    borderRadius: '0.375rem',
    fontSize: '1.125rem',
    fontWeight: 700,
  },

  removePaymentBtn: {
    padding: '0.5rem',
    backgroundColor: '#EF4444',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 700,
  },

  changeInput: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#FEF3C7',
    borderRadius: '0.5rem',
  },

  changeLabel: {
    display: 'block',
    fontSize: '0.95rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },

  input: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #F59E0B',
    borderRadius: '0.375rem',
    fontSize: '1.125rem',
  },

  changeAmount: {
    marginTop: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#10B981',
  },

  paymentStatus: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#F3F4F6',
    borderRadius: '0.5rem',
  },

  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },

  paymentOptions: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },

  paymentOption: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1.5rem',
    backgroundColor: '#F9FAFB',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  paymentIcon: {
    fontSize: '2.5rem',
  },

  paymentLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    textAlign: 'center',
  },

  subOptions: {
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },

  subOptionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },

  closeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontWeight: 600,
  },

  subOptionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },

  subOption: {
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    border: '2px solid #E5E7EB',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    transition: 'all 150ms',
  },

  confirmButton: {
    width: '100%',
    padding: '1.5rem',
    backgroundColor: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  error: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '0.5rem',
    textAlign: 'center',
    fontWeight: 600,
  },
}

export default PaymentScreen
