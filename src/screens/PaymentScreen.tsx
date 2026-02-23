// src/screens/PaymentScreen.tsx
// Versão SIMPLES que funciona

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import { useSaipos } from '../hooks/useSaipos'

interface PaymentScreenProps {
  onBack: () => void
  onSuccess: (orderId: string) => void
}

type PaymentMethod = 'dinheiro' | 'debito' | 'credito' | 'pix'

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSuccess }) => {
  const { cart, cartTotal, clearCart } = useOrder()
  const { createOrder, loading, error } = useSaipos()
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [changeFor, setChangeFor] = useState('')

  const handleConfirm = async () => {
    if (!selectedMethod) {
      alert('Selecione uma forma de pagamento!')
      return
    }

    if (selectedMethod === 'dinheiro' && !changeFor) {
      alert('Informe o valor do troco!')
      return
    }

    try {
      const items = cart.map(item => ({
        integration_code: item.product?.integration_code || 'SEM-CODIGO',
        desc_item: item.product?.name || item.name,
        quantity: item.quantity,
        unit_price: item.product?.price || item.price,
        choice_items: []
      }))

      const notes = selectedMethod === 'dinheiro' && changeFor
        ? `${getPaymentLabel(selectedMethod)} - Troco para: R$ ${changeFor}`
        : getPaymentLabel(selectedMethod)

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
        {/* Resumo */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Resumo do Pedido</h2>
          <div style={styles.summaryItems}>
            {cart.map((item, idx) => (
              <div key={idx} style={styles.summaryItem}>
                <span>{item.quantity}x {item.product?.name || item.name}</span>
                <span>R$ {(item.quantity * (item.product?.price || item.price)).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div style={styles.summaryTotal}>
            <span>Total</span>
            <span>R$ {cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Formas de Pagamento */}
        <div style={styles.paymentSection}>
          <h3 style={styles.sectionTitle}>Escolha a forma de pagamento</h3>
          
          <div style={styles.paymentGrid}>
            {/* Dinheiro */}
            <button
              onClick={() => setSelectedMethod('dinheiro')}
              style={{
                ...styles.paymentOption,
                ...(selectedMethod === 'dinheiro' ? styles.paymentOptionActive : {})
              }}
            >
              <span style={styles.paymentIcon}>💵</span>
              <span style={styles.paymentLabel}>Dinheiro</span>
            </button>

            {/* Débito */}
            <button
              onClick={() => setSelectedMethod('debito')}
              style={{
                ...styles.paymentOption,
                ...(selectedMethod === 'debito' ? styles.paymentOptionActive : {})
              }}
            >
              <span style={styles.paymentIcon}>💳</span>
              <span style={styles.paymentLabel}>Cartão Débito</span>
            </button>

            {/* Crédito */}
            <button
              onClick={() => setSelectedMethod('credito')}
              style={{
                ...styles.paymentOption,
                ...(selectedMethod === 'credito' ? styles.paymentOptionActive : {})
              }}
            >
              <span style={styles.paymentIcon}>💳</span>
              <span style={styles.paymentLabel}>Cartão Crédito</span>
            </button>

            {/* Pix */}
            <button
              onClick={() => setSelectedMethod('pix')}
              style={{
                ...styles.paymentOption,
                ...(selectedMethod === 'pix' ? styles.paymentOptionActive : {})
              }}
            >
              <span style={styles.paymentIcon}>🔷</span>
              <span style={styles.paymentLabel}>Pix</span>
            </button>
          </div>

          {/* Campo de Troco */}
          {selectedMethod === 'dinheiro' && (
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
              {changeFor && parseFloat(changeFor) >= cartTotal && (
                <div style={styles.changeAmount}>
                  Troco: R$ {(parseFloat(changeFor) - cartTotal).toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botão Confirmar */}
        {selectedMethod && (
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

const getPaymentLabel = (method: PaymentMethod): string => {
  const labels: Record<PaymentMethod, string> = {
    'dinheiro': 'Dinheiro',
    'debito': 'Cartão Débito',
    'credito': 'Cartão Crédito',
    'pix': 'Pix'
  }
  return labels[method]
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

  paymentSection: {
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
    border: '3px solid #E5E7EB',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'all 150ms',
  },

  paymentOptionActive: {
    borderColor: '#E11D48',
    backgroundColor: '#FEE2E2',
  },

  paymentIcon: {
    fontSize: '2.5rem',
  },

  paymentLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    textAlign: 'center',
  },

  changeInput: {
    marginTop: '1.5rem',
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
