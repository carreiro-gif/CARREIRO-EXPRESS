// src/screens/HomeScreen.tsx

import React from 'react'
import { Carousel, CarouselSlide } from '../components/Carousel/Carousel'
import { theme } from '../theme/theme'

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
  return (
    <div style={styles.container}>
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
        {/* Logo (opcional) */}
        <div style={styles.logoSection}>
          <h1 style={styles.logo}>CARREIRO EXPRESS</h1>
          <p style={styles.tagline}>Hambúrgueres artesanais</p>
        </div>

        {/* Botão principal */}
        <button style={styles.startButton} onClick={onStart}>
          <span style={styles.startButtonIcon}>🍔</span>
          <span style={styles.startButtonText}>TOQUE PARA COMEÇAR SEU PEDIDO</span>
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

      {/* Botão de configuração (escondido, ativado por toque longo) */}
      {onOpenConfig && (
        <button
          style={styles.configButton}
          onClick={onOpenConfig}
          onContextMenu={(e) => {
            e.preventDefault()
            onOpenConfig()
          }}
        >
          ⚙️
        </button>
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
  },

  logo: {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    color: theme.colors.primary.main,
    margin: 0,
    marginBottom: theme.spacing.sm,
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
    backgroundColor: theme.colors.primary.main,
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
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.white,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
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

  configButton: {
    position: 'fixed',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: '48px',
    height: '48px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.gray[200],
    border: 'none',
    fontSize: theme.typography.fontSize.xl,
    cursor: 'pointer',
    opacity: 0.3,
    transition: `all ${theme.transitions.fast}`,
  },
}

export default HomeScreen
