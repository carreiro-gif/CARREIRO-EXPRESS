// src/screens/PaymentScreen.tsx - EXEMPLO DE INTEGRAÇÃO

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'
import { useSaipos } from '../hooks/useSaipos'

interface PaymentScreenProps {
  onBack: () => void
  onSuccess: (orderId: string) => void
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ onBack, onSuccess }) => {
  const { cart, cartTotal, completeOrder } = useOrder()
  const { createOrder, loading, error } = useSaipos()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

  const payments = [
    { id: 'debit', name: 'Débito', icon: '💳' },
    { id: 'credit', name: 'Crédito', icon: '💳' },
    { id: 'pix', name: 'PIX', icon: '📱' },
    { id: 'cash', name: 'Dinheiro', icon: '💵' },
    { id: 'meal-voucher', name: 'Vale Alimentação', icon: '🍱' },
    { id: 'food-voucher', name: 'Vale Refeição', icon: '🍽️' },
  ]

  const handleConfirm = async () => {
    if (!selectedPayment) {
      alert('❌ Selecione uma forma de pagamento!')
      return
    }

    try {
      // 1. Enviar para Saipos
      console.log('📤 Enviando pedido para Saipos...')
      
      const result = await createOrder(
        cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          integration_code: item.id, // ou código de integração real
          notes: item.observations || '',
        })),
        cartTotal,
        `Pagamento: ${payments.find(p => p.id === selectedPayment)?.name}`
      )

      if (!result.success) {
        alert(`❌ ${result.error}`)
        return
      }

      console.log('✅ Pedido enviado para Saipos:', result.display_id)

      // 2. Registrar no sistema local
      const localOrderId = completeOrder(selectedPayment)

      // 3. Ir para tela de sucesso
      onSuccess(result.display_id || localOrderId)

    } catch (err: any) {
      console.error('❌ Erro ao finalizar pedido:', err)
      alert('❌ Erro ao processar pedido. Tente novamente.')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>← Voltar</button>
        <h1 style={styles.title}>Pagamento</h1>
      </div>

      {/* Resumo */}
      <div style={styles.summary}>
        <h2 style={styles.summaryTitle}>Resumo do Pedido</h2>
        {cart.map(item => (
          <div key={item.id} style={styles.item}>
            <span>{item.quantity}x {item.name}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={styles.total}>
          <span>TOTAL</span>
          <span>R$ {cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Formas de Pagamento */}
      <div style={styles.payments}>
        <h2>Escolha a forma de pagamento</h2>
        <div style={styles.paymentGrid}>
          {payments.map(payment => (
            <button
              key={payment.id}
              style={{
                ...styles.paymentBtn,
                backgroundColor: selectedPayment === payment.id ? '#E11D48' : '#FFF',
                color: selectedPayment === payment.id ? '#FFF' : '#374151',
              }}
              onClick={() => setSelectedPayment(payment.id)}
            >
              <span style={{ fontSize: '3rem' }}>{payment.icon}</span>
              <span>{payment.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div style={styles.error}>
          ❌ {error}
        </div>
      )}

      {/* Botão Confirmar */}
      <div style={styles.footer}>
        <button
          style={{
            ...styles.confirmBtn,
            opacity: selectedPayment && !loading ? 1 : 0.5,
            cursor: selectedPayment && !loading ? 'pointer' : 'not-allowed',
          }}
          onClick={handleConfirm}
          disabled={!selectedPayment || loading}
        >
          {loading ? '⏳ Processando...' : '✅ CONFIRMAR PEDIDO'}
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
    paddingBottom: '120px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: '#FFF',
  },
  backBtn: {
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
  summary: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '2rem',
    backgroundColor: '#FFF',
    borderRadius: '0.75rem',
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
  },
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 0',
    borderBottom: '1px solid #E5E7EB',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1.5rem 0',
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  payments: {
    maxWidth: '800px',
    margin: '2rem auto',
    padding: '0 2rem',
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  paymentBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '2rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.75rem',
    cursor: 'pointer',
  },
  error: {
    maxWidth: '800px',
    margin: '1rem auto',
    padding: '1rem',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '0.5rem',
    textAlign: 'center',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '1.5rem 2rem',
    backgroundColor: '#FFF',
  },
  confirmBtn: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'block',
    padding: '1.5rem',
    fontSize: '1.5rem',
    fontWeight: 800,
    backgroundColor: '#10B981',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.75rem',
  },
}

export default PaymentScreen
