// src/screens/HomeScreen.tsx - VERSÃO FINAL

import React, { useState, useRef } from 'react'
import { Carousel } from '../components/Carousel/Carousel'
import { useConfig } from '../context/ConfigContext'

interface HomeScreenProps {
  onStart: () => void
  onOpenConfig?: () => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onOpenConfig }) => {
  const { config } = useConfig()
  
  const [clickCount, setClickCount] = useState(0)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  const ADMIN_PASSWORD = localStorage.getItem('carreiro-admin-password') || '1234'
  const CLICKS_NEEDED = 3

  const handleLogoClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (clickTimeout.current) clearTimeout(clickTimeout.current)

    if (newCount >= CLICKS_NEEDED) {
      setShowPasswordModal(true)
      setClickCount(0)
    } else {
      clickTimeout.current = setTimeout(() => setClickCount(0), 2000)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false)
      setPassword('')
      onOpenConfig?.()
    } else {
      alert('❌ Senha incorreta!')
      setPassword('')
    }
  }

  const slides = config.carouselSlides?.length > 0
    ? config.carouselSlides
    : [{
        id: 'default',
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080&h=1920&fit=crop',
        title: 'Bem-vindo!',
        subtitle: 'Configure o carrossel no admin',
      }]

  return (
    <div style={{ ...styles.container, backgroundColor: config.backgroundColor }}>
      {/* Carrossel - Altura fixa */}
      <div style={styles.carouselSection}>
        <Carousel
          slides={slides}
          autoplay={true}
          autoplayDelay={5000}
          showIndicators={true}
        />
      </div>

      {/* Conteúdo */}
      <div style={styles.content}>
        <div style={styles.logoSection} onClick={handleLogoClick}>
          {config.logoUrl && (
            <img
              src={config.logoUrl}
              alt={config.storeName}
              style={styles.logoImage}
            />
          )}
          
          <h1 style={{ ...styles.storeName, color: config.textColor }}>
            {config.storeName}
          </h1>
          <p style={{ ...styles.tagline, color: config.secondaryTextColor }}>
            {config.tagline}
          </p>
        </div>

        <button
          style={{
            ...styles.startButton,
            backgroundColor: config.primaryColor,
            color: config.buttonTextColor,
          }}
          onClick={onStart}
        >
          <span style={styles.startButtonIcon}>🍔</span>
          <span style={styles.startButtonText}>{config.buttonText}</span>
        </button>

        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>⚡</span>
            <span style={{ ...styles.infoText, color: config.secondaryTextColor }}>
              Pedido rápido
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>💳</span>
            <span style={{ ...styles.infoText, color: config.secondaryTextColor }}>
              Múltiplas formas de pagamento
            </span>
          </div>
        </div>
      </div>

      {/* Modal Senha */}
      {showPasswordModal && (
        <div style={styles.modalOverlay} onClick={() => setShowPasswordModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>🔒 Acesso Admin</h2>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                style={styles.passwordInput}
                autoFocus
              />
              <div style={styles.modalButtons}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={styles.confirmButton}>
                  Entrar
                </button>
              </div>
            </form>
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
    display: 'flex',
    flexDirection: 'column',
  },

  carouselSection: {
    width: '100%',
    height: '50vh', // 50% da altura da tela
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    gap: '2rem',
  },

  logoSection: {
    textAlign: 'center',
    cursor: 'pointer',
    userSelect: 'none',
  },

  logoImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    marginBottom: '1rem',
  },

  storeName: {
    fontSize: '3rem',
    fontWeight: 800,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  tagline: {
    fontSize: '1.25rem',
    margin: 0,
    marginTop: '0.5rem',
  },

  startButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    maxWidth: '600px',
    padding: '2rem',
    border: 'none',
    borderRadius: '1rem',
    cursor: 'pointer',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    transition: 'all 150ms ease-in-out',
  },

  startButtonIcon: {
    fontSize: '64px',
  },

  startButtonText: {
    fontSize: '2rem',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },

  infoSection: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },

  infoIcon: {
    fontSize: '1.5rem',
  },

  infoText: {
    fontSize: '1rem',
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
  },

  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '1rem',
  },

  passwordInput: {
    width: '100%',
    padding: '1rem',
    fontSize: '1.25rem',
    border: '2px solid #D1D5DB',
    borderRadius: '0.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },

  modalButtons: {
    display: 'flex',
    gap: '1rem',
  },

  cancelButton: {
    flex: 1,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  confirmButton: {
    flex: 1,
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 700,
    backgroundColor: '#E11D48',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
}

export default HomeScreen
