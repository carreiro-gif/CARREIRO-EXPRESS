// src/screens/HomeScreen.tsx
// CORRIGIDO - Senha abre Admin

import React, { useState } from 'react'
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

  const ADMIN_PASSWORD = '1234' // Senha padrão

  const handleLogoClick = () => {
    const now = Date.now()
    
    // Reset se passou mais de 2 segundos
    if (now - lastClickTime > 2000) {
      setClickCount(1)
    } else {
      setClickCount(prev => prev + 1)
    }
    
    setLastClickTime(now)

    // 5 cliques rápidos = abrir senha
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
      onAdminAccess() // ⭐ CHAMAR ADMIN
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

  logoContainer: {
    textAlign: 'center',
    marginBottom: '3rem',
    cursor: 'pointer',
    userSelect: 'none',
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
  },

  footerText: {
    fontSize: '1rem',
    color: '#FFF',
    margin: '0.5rem 0',
    opacity: 0.8,
  },
}

export default HomeScreen
