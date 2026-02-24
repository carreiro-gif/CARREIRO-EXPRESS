// src/screens/HomeScreen.tsx
// CORRIGIDO - Verifica se carouselImages existe

import React, { useState, useEffect } from 'react'
import { useConfig } from '../context/ConfigContext'

interface HomeScreenProps {
  onStart: () => void
  onAdminAccess: () => void
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onAdminAccess }) => {
  const { config } = useConfig()
  const [showPasswordInput, setShowPasswordInput] = useState(false)
  const [password, setPassword] = useState('')
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const ADMIN_PASSWORD = '1234'

  // ⭐ FIX: Verificar se carouselImages existe e é array
  const carouselImages = Array.isArray(config.carouselImages) ? config.carouselImages : []
  const hasCarousel = config.carouselEnabled && carouselImages.length > 0

  // Carrossel automático
  useEffect(() => {
    if (!hasCarousel) return

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => 
        (prev + 1) % carouselImages.length
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [hasCarousel, carouselImages.length])

  const handleLogoClick = () => {
    const now = Date.now()
    
    if (now - lastClickTime > 2000) {
      setClickCount(1)
    } else {
      setClickCount(prev => prev + 1)
    }
    
    setLastClickTime(now)

    if (clickCount >= 4) {
      setShowPasswordInput(true)
      setClickCount(0)
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setShowPasswordInput(false)
      setPassword('')
      onAdminAccess()
    } else {
      alert('Senha incorreta!')
      setPassword('')
    }
  }

  const handleCancelPassword = () => {
    setShowPasswordInput(false)
    setPassword('')
    setClickCount(0)
  }

  return (
    <div style={styles.container}>
      {/* Carrossel de Imagens */}
      {hasCarousel && (
        <div style={styles.carouselContainer}>
          <img
            src={carouselImages[currentImageIndex]}
            alt="Carousel"
            style={styles.carouselImage}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop'
            }}
          />
          {carouselImages.length > 1 && (
            <div style={styles.carouselDots}>
              {carouselImages.map((_, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.dot,
                    backgroundColor: idx === currentImageIndex ? '#FFF' : 'rgba(255,255,255,0.5)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Logo */}
      <div 
        onClick={handleLogoClick}
        style={styles.logoContainer}
      >
        <h1 style={styles.title}>{config.storeName || 'Carreiro Express'}</h1>
        <p style={styles.subtitle}>Lanches e Porções</p>
      </div>

      {/* Botão Iniciar */}
      {!showPasswordInput && (
        <button onClick={onStart} style={styles.startButton}>
          Tocar para Iniciar
        </button>
      )}

      {/* Input de Senha */}
      {showPasswordInput && (
        <div style={styles.passwordOverlay}>
          <div style={styles.passwordModal}>
            <h2 style={styles.passwordTitle}>Acesso Admin</h2>
            <form onSubmit={handlePasswordSubmit} style={styles.passwordForm}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                style={styles.passwordInput}
                autoFocus
              />
              <div style={styles.passwordButtons}>
                <button 
                  type="button" 
                  onClick={handleCancelPassword}
                  style={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  style={styles.confirmButton}
                >
                  Entrar
                </button>
              </div>
            </form>
            <p style={styles.passwordHint}>
              Senha padrão: 1234
            </p>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          {config.storeAddress || 'Endereço da loja'}
        </p>
        <p style={styles.footerText}>
          {config.storePhone || 'Telefone'}
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#E11D48',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  carouselContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden',
  },

  carouselImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },

  carouselDots: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '0.5rem',
  },

  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'background-color 300ms',
  },

  logoContainer: {
    textAlign: 'center',
    marginBottom: '3rem',
    cursor: 'pointer',
    userSelect: 'none',
    zIndex: 10,
  },

  title: {
    fontSize: '4rem',
    fontWeight: 900,
    color: '#FFF',
    margin: 0,
    marginBottom: '1rem',
    textShadow: '0 4px 6px rgba(0,0,0,0.3)',
  },

  subtitle: {
    fontSize: '1.5rem',
    color: '#FFF',
    margin: 0,
    opacity: 0.9,
  },

  startButton: {
    padding: '2rem 4rem',
    fontSize: '2rem',
    fontWeight: 700,
    backgroundColor: '#FFF',
    color: '#E11D48',
    border: 'none',
    borderRadius: '1rem',
    cursor: 'pointer',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    transition: 'transform 150ms',
    zIndex: 10,
  },

  passwordOverlay: {
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
  },

  passwordModal: {
    backgroundColor: '#FFF',
    borderRadius: '1rem',
    padding: '2rem',
    maxWidth: '400px',
    width: '90%',
  },

  passwordTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#111827',
  },

  passwordForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },

  passwordInput: {
    padding: '1rem',
    fontSize: '1.25rem',
    border: '2px solid #E5E7EB',
    borderRadius: '0.5rem',
    textAlign: 'center',
    letterSpacing: '0.5rem',
  },

  passwordButtons: {
    display: 'flex',
    gap: '1rem',
  },

  cancelButton: {
    flex: 1,
    padding: '1rem',
    fontSize: '1.125rem',
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
    fontSize: '1.125rem',
    fontWeight: 600,
    backgroundColor: '#E11D48',
    color: '#FFF',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },

  passwordHint: {
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: '#6B7280',
    textAlign: 'center',
  },

  footer: {
    position: 'absolute',
    bottom: '2rem',
    textAlign: 'center',
    zIndex: 10,
  },

  footerText: {
    fontSize: '1rem',
    color: '#FFF',
    margin: '0.5rem 0',
    opacity: 0.8,
  },
}

export default HomeScreen
