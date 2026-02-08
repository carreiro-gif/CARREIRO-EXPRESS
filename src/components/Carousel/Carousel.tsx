// src/components/Carousel/Carousel.tsx - VERSÃO CORRIGIDA

import React, { useState, useEffect, useCallback } from 'react'

export interface CarouselSlide {
  id: string
  imageUrl: string
  title?: string
  subtitle?: string
}

interface CarouselProps {
  slides: CarouselSlide[]
  autoplay?: boolean
  autoplayDelay?: number
  showIndicators?: boolean
}

export const Carousel: React.FC<CarouselProps> = ({
  slides,
  autoplay = true,
  autoplayDelay = 5000,
  showIndicators = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Avançar slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Autoplay
  useEffect(() => {
    if (!autoplay || slides.length <= 1) return

    const interval = setInterval(nextSlide, autoplayDelay)
    return () => clearInterval(interval)
  }, [autoplay, autoplayDelay, nextSlide, slides.length])

  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div style={styles.container}>
      {/* Imagem atual - SEM CORTAR */}
      <div style={styles.imageWrapper}>
        <img
          src={slides[currentIndex].imageUrl}
          alt={slides[currentIndex].title || `Slide ${currentIndex + 1}`}
          style={styles.image}
        />

        {/* Overlay gradiente */}
        {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
          <div style={styles.overlay} />
        )}

        {/* Conteúdo */}
        {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
          <div style={styles.content}>
            {slides[currentIndex].title && (
              <h2 style={styles.title}>{slides[currentIndex].title}</h2>
            )}
            {slides[currentIndex].subtitle && (
              <p style={styles.subtitle}>{slides[currentIndex].subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Indicadores */}
      {showIndicators && slides.length > 1 && (
        <div style={styles.indicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                ...styles.indicator,
                backgroundColor: index === currentIndex ? '#E11D48' : '#FFFFFF',
                opacity: index === currentIndex ? 1 : 0.5,
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#000000',
  },

  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain', // CONTAIN = NÃO CORTA, mostra imagem inteira
    userSelect: 'none',
  },

  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    pointerEvents: 'none',
  },

  content: {
    position: 'absolute',
    bottom: '2rem',
    left: '2rem',
    right: '2rem',
    color: '#FFFFFF',
    zIndex: 10,
  },

  title: {
    fontSize: '2.5rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    lineHeight: 1.2,
  },

  subtitle: {
    fontSize: '1.5rem',
    fontWeight: 500,
    textShadow: '0 1px 4px rgba(0,0,0,0.5)',
    opacity: 0.95,
  },

  indicators: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '0.5rem',
    zIndex: 20,
  },

  indicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 150ms ease-in-out',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
}

export default Carousel
