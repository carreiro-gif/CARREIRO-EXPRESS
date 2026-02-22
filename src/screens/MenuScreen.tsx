// src/screens/MenuScreen.tsx - VERSÃO MINIMALISTA

import React, { useState } from 'react'
import { useOrder } from '../context/OrderContext'

interface MenuScreenProps {
  onBack: () => void
  onCheckout: () => void
}

const PRODUCTS = [
  { id: '1', name: 'X-Bacon', price: 25.90, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop' },
  { id: '2', name: 'X-Salada', price: 22.90, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop' },
  { id: '3', name: 'X-Egg', price: 24.90, image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop' },
  { id: '4', name: 'Batata Frita', price: 12.00, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop' },
  { id: '5', name: 'Refrigerante', price: 5.00, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&h=300&fit=crop' },
]

const MenuScreen: React.FC<MenuScreenProps> = ({ onBack, onCheckout }) => {
  const { cart, addToCart, cartTotal, cartCount } = useOrder()

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#F9FAFB', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem', backgroundColor: '#FFF', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <button onClick={onBack} style={{ padding: '0.75rem 1.5rem', fontSize: '1.125rem', fontWeight: 600, backgroundColor: '#F3F4F6', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
          ← Voltar
        </button>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Cardápio</h1>
      </div>

      {/* Produtos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {PRODUCTS.map(product => (
          <div key={product.id} style={{ backgroundColor: '#FFF', borderRadius: '0.75rem', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, marginBottom: '1rem' }}>{product.name}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#E11D48' }}>R$ {product.price.toFixed(2)}</span>
                <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 600, backgroundColor: '#E11D48', color: '#FFF', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
                  + Adicionar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carrinho Fixo */}
      {cartCount > 0 && (
        <div onClick={onCheckout} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#E11D48', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', boxShadow: '0 -4px 6px rgba(0,0,0,0.1)', zIndex: 100 }}>
          <div>
            <div style={{ fontSize: '1.125rem', color: '#FFF', fontWeight: 500 }}>🛒 {cartCount} itens</div>
            <div style={{ fontSize: '2rem', color: '#FFF', fontWeight: 800 }}>R$ {cartTotal.toFixed(2)}</div>
          </div>
          <button style={{ padding: '1rem 2rem', fontSize: '1.25rem', fontWeight: 700, backgroundColor: '#FFF', color: '#E11D48', border: 'none', borderRadius: '0.75rem', cursor: 'pointer' }}>
            IR PARA PAGAMENTO →
          </button>
        </div>
      )}
    </div>
  )
}

export default MenuScreen
