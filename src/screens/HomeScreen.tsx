// src/screens/HomeScreen.tsx

import React from 'react'
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
  // Pegar configurações personalizadas (logo, nome, cor, texto do botão)
  const config = useConfig ? useConfig() : null
  
  const storeName = config?.storeName || 'CARREIRO LANCHES'
  const logoUrl = config?.logoUrl || null
  const buttonText = config?.buttonText || 'PEÇA AQUI'
  const backgroundColor = config?.backgroundColor || theme.colors.background.default
  const primaryColor = config?.primaryColor || theme.colors.primary.main

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
        {/* Logo + Nome da loja */}
        <div style={styles.logoSection}>
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

      {/* Botão de configuração (canto inferior direito, semi-oculto) */}
      {onOpenConfig && (
        <button
          style={styles.configButton}
          onClick={onOpenConfig}
          title="Configurações (Admin)"
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
  },

  logoImage: {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
    marginBottom: theme.spacing.md,
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

  configButton: {
    position: 'fixed',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: '56px',
    height: '56px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral.gray[200],
    border: 'none',
    fontSize: theme.typography.fontSize['2xl'],
    cursor: 'pointer',
    opacity: 0.3,
    transition: `all ${theme.transitions.fast}`,
    boxShadow: theme.shadows.md,
  },
}

export default HomeScreen
