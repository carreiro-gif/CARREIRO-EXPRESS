// src/screens/HomeScreen.tsx

import React, { useState, useRef } from 'react'
import { Carousel, CarouselSlide } from '../components/Carousel/Carousel'
import { theme } from '../theme/theme'
import { useConfig } from '../context/ConfigContext'

interface HomeScreenProps {
  onStart: () => void
  onOpenConfig?: () => void
}

// DADOS MOCKADOS DO CARROSSEL (depois virá do admin)
const mockSlides: CarouselSlide[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=675&fit=crop',
    title: 'Combo X-Bacon + Batata + Refri',
    subtitle: 'Por apenas R$ 35,90 - Oferta válida hoje!',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1200&h=675&fit=crop',
    title: 'Novidade: X-Carreiro Supreme',
    subtitle: 'Hambúrguer artesanal com bacon crocante',
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&h=675&fit=crop',
    title: 'Sobremesas imperdíveis',
    subtitle: 'Milk-shake, sorvetes e muito mais',
  },
]

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onOpenConfig }) => {
  // Pegar configurações personalizadas
  const config = useConfig ? useConfig()?.config : null
  
  const storeName = config?.storeName || 'CARREIRO LANCHES'
  const logoUrl = config?.logoUrl || null
  const buttonText = config?.buttonText || 'PEÇA AQUI'
  const backgroundColor = config?.backgroundColor || theme.colors.background.default
  const primaryColor = config?.primaryColor || theme.colors.primary.main

  // Sistema de cliques secretos para acessar admin
  const [clickCount, setClickCount] = useState(0)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [password, setPassword] = useState('')
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)

  // Senha padrão (pode ser configurada depois)
  const ADMIN_PASSWORD = '1234'
  const CLICKS_NEEDED = 3

  // Handler de cliques na logo
  const handleLogoClick = () => {
    // Incrementar contador
    const newCount = clickCount + 1
    setClickCount(newCount)

    // Limpar timeout anterior
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }

    // Se atingiu os cliques necessários, mostrar modal de senha
    if (newCount >= CLICKS_NEEDED) {
      setShowPasswordModal(true)
      setClickCount(0)
    } else {
      // Resetar contador após 2 segundos
      clickTimeout.current = setTimeout(() => {
        setClickCount(0)
      }, 2000)
    }
  }

  // Verificar senha
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false)
      setPassword('')
      if (onOpenConfig) {
        onOpenConfig()
      }
    } else {
      alert('❌ Senha incorreta!')
      setPassword('')
    }
  }

  return (
    <div style={{ ...styles.container, backgroundColor }}>
      {/* Carrossel principal */}
      <div style={styles.carouselSection}>
        <Carousel
          slides={mockSlides}
          autoplay={true}
          autoplayDelay={5000}
          showIndicators={true}
          showArrows={false}
          aspectRatio="16/9"
        />
      </div>

      {/* Conteúdo central */}
      <div style={styles.content}>
        {/* Logo + Nome da loja (CLICÁVEL PARA ADMIN) */}
        <div 
          style={styles.logoSection}
          onClick={handleLogoClick}
        >
          {/* Logo (se configurada) */}
          {logoUrl && (
            <img
              src={logoUrl}
              alt={storeName}
              style={styles.logoImage}
            />
          )}
          
          {/* Nome da loja */}
          <h1 style={{ ...styles.storeName, color: primaryColor }}>
            {storeName}
          </h1>
          <p style={styles.tagline}>Hambúrgueres artesanais</p>
        </div>

        {/* Botão principal - PEÇA AQUI */}
        <button
          style={{ ...styles.startButton, backgroundColor: primaryColor }}
          onClick={onStart}
        >
          <span style={styles.startButtonIcon}>🍔</span>
          <span style={styles.startButtonText}>{buttonText}</span>
        </button>

        {/* Informações secundárias */}
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>⚡</span>
            <span style={styles.infoText}>Pedido rápido</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>💳</span>
            <span style={styles.infoText}>Múltiplas formas de pagamento</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoIcon}>🎁</span>
            <span style={styles.infoText}>Promoções exclusivas</span>
          </div>
        </div>
      </div>

      {/* Modal de senha do admin */}
      {showPasswordModal && (
        <div 
          style={styles.modalOverlay}
          onClick={() => {
            setShowPasswordModal(false)
            setPassword('')
          }}
        >
          <div 
            style={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={styles.modalTitle}>🔒 Acesso Administrativo</h2>
            <p style={styles.modalSubtitle}>Digite a senha para continuar</p>
            
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite a senha"
                style={styles.passwordInput}
                autoFocus
              />
              
              <div style={styles.modalButtons}>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => {
                    setShowPasswordModal(false)
                    setPassword('')
                  }}
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

            <p style={styles.hint}>
              💡 Dica: Clique 3 vezes na logo para abrir este menu
            </p>
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
    position: 'relative',
  },

  carouselSection: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: theme.spacing.xl,
  },

  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing['2xl'],
    gap: theme.spacing['2xl'],
  },

  logoSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.md,
    cursor: 'pointer', // Indicar que é clicável
    userSelect: 'none', // Evitar seleção de texto ao clicar rápido
  },

  logoImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    marginBottom: theme.spacing.md,
    pointerEvents: 'none', // Evitar arrastar imagem
  },

  storeName: {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  tagline: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral.gray[600],
    margin: 0,
  },

  startButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    width: '100%',
    maxWidth: '600px',
    height: '160px',
    border: 'none',
    borderRadius: theme.borderRadius.xl,
    cursor: 'pointer',
    boxShadow: theme.shadows.xl,
    transition: `all ${theme.transitions.normal}`,
    padding: theme.spacing.xl,
  },

  startButtonIcon: {
    fontSize: '64px',
    lineHeight: 1,
  },

  startButtonText: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.neutral.white,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },

  infoSection: {
    display: 'flex',
    gap: theme.spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },

  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  infoIcon: {
    fontSize: theme.typography.fontSize['2xl'],
  },

  infoText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral.gray[600],
  },

  // Modal de senha
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
    padding: theme.spacing['3xl'],
    maxWidth: '500px',
    width: '100%',
    boxShadow: theme.shadows['2xl'],
  },

  modalTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    color: theme.colors.neutral.gray[900],
  },

  modalSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.neutral.gray[600],
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },

  passwordInput: {
    width: '100%',
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.xl,
    border: `2px solid ${theme.colors.neutral.gray[300]}`,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    letterSpacing: '0.3em',
    fontWeight: theme.typography.fontWeight.bold,
  },

  modalButtons: {
    display: 'flex',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },

  cancelButton: {
    flex: 1,
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    backgroundColor: theme.colors.neutral.gray[200],
    color: theme.colors.neutral.gray[700],
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
  },

  confirmButton: {
    flex: 1,
    padding: theme.spacing.lg,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.neutral.white,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    cursor: 'pointer',
    boxShadow: theme.shadows.md,
    transition: `all ${theme.transitions.fast}`,
  },

  hint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray[500],
    textAlign: 'center',
    margin: 0,
  },
}

export default HomeScreen
