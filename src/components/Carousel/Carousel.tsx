// src/components/Carousel/Carousel.tsx

import React, { useState, useEffect, useCallback } from 'react'
import { theme } from '../../theme/theme'

export interface CarouselSlide {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
  link?: string
}

interface CarouselProps {
  slides: CarouselSlide[]
  autoplay?: boolean
  autoplayDelay?: number
  showIndicators?: boolean
  showArrows?: boolean
  aspectRatio?: string
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoplay = true,
  autoplayDelay = 5000,
  showIndicators = true,
  showArrows = false,
  aspectRatio = '16/9',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Avançar slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, slides.length])

  // Voltar slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, slides.length])

  // Ir para slide específico
  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Autoplay
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return

    const interval = setInterval(nextSlide, autoplayDelay)
    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, nextSlide, slides.length])

  if (!slides || slides.length === 0) {
    return null
  }

  const currentSlide = slides[currentIndex]

  return (
    <div style={styles.container}>
      {/* Wrapper do carrossel */}
      <div style={{ ...styles.carouselWrapper, aspectRatio }}>
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              ...styles.slide,
              opacity: index === currentIndex ? 1 : 0,
              transform: `translateX(${(index - currentIndex) * 100}%)`,
              transition: isTransitioning ? 'all 500ms ease-in-out' : 'none',
            }}
          >
            {/* Imagem de fundo */}
            <img
              src={slide.imageUrl}
              alt={slide.title || `Slide ${index + 1}`}
              style={styles.image}
            />

            {/* Overlay gradiente (melhor legibilidade do texto) */}
            {(slide.title || slide.subtitle) && (
              <div style={styles.overlay} />
            )}

            {/* Conteúdo do slide */}
            {(slide.title || slide.subtitle) && (
              <div style={styles.content}>
                {slide.title && <h2 style={styles.title}>{slide.title}</h2>}
                {slide.subtitle && <p style={styles.subtitle}>{slide.subtitle}</p>}
              </div>
            )}
          </div>
        ))}

        {/* Setas de navegação */}
        {showArrows && slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              style={{ ...styles.arrow, ...styles.arrowLeft }}
              aria-label="Slide anterior"
            >
              ‹
            </button>
            <button
              onClick={nextSlide}
              style={{ ...styles.arrow, ...styles.arrowRight }}
              aria-label="Próximo slide"
            >
              ›
            </button>
          </>
        )}

        {/* Indicadores */}
        {showIndicators && slides.length > 1 && (
          <div style={styles.indicators}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                style={{
                  ...styles.indicator,
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.primary.main
                      : theme.colors.neutral.white,
                  opacity: index === currentIndex ? 1 : 0.5,
                }}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },

  carouselWrapper: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.neutral.gray[900],
  },

  slide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    userSelect: 'none',
    pointerEvents: 'none',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
    pointerEvents: 'none',
  },

  content: {
    position: 'absolute',
    bottom: theme.spacing['2xl'],
    left: theme.spacing['2xl'],
    right: theme.spacing['2xl'],
    color: theme.colors.neutral.white,
    zIndex: 10,
    textAlign: 'left',
  },

  title: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    marginBottom: theme.spacing.md,
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    lineHeight: theme.typography.lineHeight.tight,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.medium,
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
    opacity: 0.95,
    lineHeight: theme.typography.lineHeight.normal,
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '56px',
    height: '56px',
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: 'none',
    fontSize: '32px',
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.gray[900],
    cursor: 'pointer',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.shadows.lg,
    transition: `all ${theme.transitions.fast}`,
  },

  arrowLeft: {
    left: theme.spacing.lg,
  },

  arrowRight: {
    right: theme.spacing.lg,
  },

  indicators: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: theme.spacing.sm,
    zIndex: 20,
  },

  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: theme.borderRadius.full,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    boxShadow: theme.shadows.md,
  },
}
